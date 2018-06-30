/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// ============================================================================================================================
// Make Purchase - creates purchase Contract
// Inputs - userID, sellerID, productID, quantity
// ============================================================================================================================
func (t *SimpleChaincode) makePurchase(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments")
	}
	var err error

	//creates contract struct with properties, and get sellerID, userID, productID, quantity from args
	var contract Contract
	contract.Id = "c" + randomInts(6)
	contract.UserId = args[0]
	contract.SellerId = args[1]
	contract.ProductId = args[2]
	quantity, err := strconv.Atoi(args[3])
	if err != nil {
		return shim.Error("4th argument 'quantity' must be a numeric string")
	}
	contract.Quantity = quantity

	//get seller
	sellerAsBytes, err := stub.GetState(contract.SellerId)
	if err != nil {
		return shim.Error("Failed to get seller")
	}
	var seller Seller
	json.Unmarshal(sellerAsBytes, &seller)
	if seller.Type != TYPE_SELLER {
		return shim.Error("Not seller type")
	}

	//find the product
	var product Product
	productFound := false
	for h := 0; h < len(seller.Products); h++ {
		if seller.Products[h].Id == contract.ProductId {
			productFound = true
			product = seller.Products[h]
			break
		}
	}

	//if product not found return error
	if productFound != true {
		return shim.Error("Product not found")
	}

	//calculates cost and assigns to contract
	contract.Cost = product.Price * contract.Quantity
	//gets product name
	contract.ProductName = product.Name
	//assign 'Pending' state
	contract.State = STATE_PENDING

	// get user's current state
	var user User
	userAsBytes, err := stub.GetState(contract.UserId)
	if err != nil {
		return shim.Error("Failed to get user")
	}
	json.Unmarshal(userAsBytes, &user)
	if user.Type != TYPE_USER {
		return shim.Error("Not user type")
	}

	//check if user has enough Fitcoinsbalance
	if user.FitcoinsBalance < contract.Cost {
		return shim.Error("Insufficient funds")
	}

	//store contract
	contractAsBytes, _ := json.Marshal(contract)
	err = stub.PutState(contract.Id, contractAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//append contractId
	user.ContractIds = append(user.ContractIds, contract.Id)

	//update user's state
	updatedUserAsBytes, _ := json.Marshal(user)
	err = stub.PutState(contract.UserId, updatedUserAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//return contract info
	fmt.Println("contractAsBytes")
	fmt.Println(contractAsBytes)
	return shim.Success(contractAsBytes)

}

// ============================================================================================================================
// Transact Purchase - update user account, update seller's account and product inventory, update contract state
// Inputs - memberId, contractID, newState(complete or declined)
// ============================================================================================================================
func (t *SimpleChaincode) transactPurchase(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments")
	}
	//get contractID args
	memberId := args[0]
	contractId := args[1]
	newState := args[2]

	// Get contract from the ledger
	contractAsBytes, err := stub.GetState(contractId)
	if err != nil {
		return shim.Error("Failed to get contract")
	}
	var contract Contract
	json.Unmarshal(contractAsBytes, &contract)

	//ensure call is called by authorized user
	if memberId != contract.SellerId && memberId != contract.UserId {
		return shim.Error("Member not authorized to update contract")
	}

	//if current contract state is pending, then execute transaction
	if contract.State == STATE_PENDING {
		if newState == STATE_COMPLETE && memberId == contract.SellerId {
			//get seller
			var member Seller
			memberAsBytes, err := stub.GetState(memberId)
			if err != nil {
				return shim.Error("Failed to get member")
			}
			json.Unmarshal(memberAsBytes, &member)

			//get contract user's current state
			var contractUser User
			contractUserAsBytes, err := stub.GetState(contract.UserId)
			if err != nil {
				return shim.Error("Failed to get contract owner")
			}
			json.Unmarshal(contractUserAsBytes, &contractUser)

			//update user's FitcoinsBalance
			if (contractUser.FitcoinsBalance - contract.Cost) >= 0 {
				contractUser.FitcoinsBalance = contractUser.FitcoinsBalance - contract.Cost
			} else {
				return shim.Error("Insufficient fitcoins")
			}

			//update seller's product count
			productFound := false
			for h := 0; h < len(member.Products); h++ {
				if member.Products[h].Id == contract.ProductId {
					productFound = true
					if member.Products[h].Count >= contract.Quantity {
						member.Products[h].Count = member.Products[h].Count - contract.Quantity
					}
					break
				}
			}
			//if product not found return error
			if productFound == true {
				//update seller's FitcoinsBalance
				member.FitcoinsBalance = member.FitcoinsBalance + contract.Cost
				//update user state
				updatedUserAsBytes, _ := json.Marshal(contractUser)
				err = stub.PutState(contract.UserId, updatedUserAsBytes)
				if err != nil {
					return shim.Error(err.Error())
				}
				//update seller state
				updatedSellerAsBytes, _ := json.Marshal(member)
				err = stub.PutState(contract.SellerId, updatedSellerAsBytes)
				if err != nil {
					return shim.Error(err.Error())
				}
				contract.State = STATE_COMPLETE

			} else {
				contract.State = STATE_DECLINED
				declinedContractAsBytes, _ := json.Marshal(contract)
				err = stub.PutState(contract.Id, declinedContractAsBytes)
				if err != nil {
					return shim.Error(err.Error())
				}
				return shim.Error("Product not available for sale. Cancelling contract.")
			}
		} else if newState == STATE_DECLINED {
			contract.State = STATE_DECLINED
		} else {
			return shim.Error("Invalid new state")
		}

		// update contract state on ledger
		updatedContractAsBytes, _ := json.Marshal(contract)
		err = stub.PutState(contract.Id, updatedContractAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}
		//return contract info
		return shim.Success(updatedContractAsBytes)
	} else {
		return shim.Error("Contract already Complete or Declined")
	}
}

// ============================================================================================================================
// Get all user contracts
// Inputs - userID
// ============================================================================================================================
func (t *SimpleChaincode) getAllUserContracts(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments")
	}
	var err error

	//get userID from args
	user_id := args[0]

	//get user
	userAsBytes, err := stub.GetState(user_id)
	if err != nil {
		return shim.Error("Failed to get user")
	}
	var user User
	json.Unmarshal(userAsBytes, &user)
	if user.Type != TYPE_USER {
		return shim.Error("Not user type")
	}

	//get user contracts
	var contracts []Contract
	for h := 0; h < len(user.ContractIds); h++ {
		//get contract from the ledger
		contractAsBytes, err := stub.GetState(user.ContractIds[h])
		if err != nil {
			return shim.Error("Failed to get contract")
		}
		var contract Contract
		json.Unmarshal(contractAsBytes, &contract)
		contracts = append(contracts, contract)
	}
	//change to array of bytes
	contractsAsBytes, _ := json.Marshal(contracts)
	return shim.Success(contractsAsBytes)

}

// ============================================================================================================================
// Get all contracts
// Inputs - (none)
// ============================================================================================================================
func (t *SimpleChaincode) getAllContracts(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	var contracts []Contract

	// ---- Get All Contracts ---- //
	resultsIterator, err := stub.GetStateByRange("c0", "c9999999999999999999")
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		aKeyValue, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		queryKeyAsStr := aKeyValue.Key
		queryValAsBytes := aKeyValue.Value
		fmt.Println("on contract id - ", queryKeyAsStr)
		var contract Contract
		json.Unmarshal(queryValAsBytes, &contract)
		contracts = append(contracts, contract)
	}

	//change to array of bytes
	contractsAsBytes, _ := json.Marshal(contracts)
	return shim.Success(contractsAsBytes)

}

//generate an array of random ints
func randomArray(len int) []int {
	a := make([]int, len)
	for i := 0; i <= len-1; i++ {
		a[i] = rand.Intn(10)
	}
	return a
}

// Generate a random string of ints with length len
func randomInts(len int) string {
	rand.Seed(time.Now().UnixNano())
	intArray := randomArray(len)
	var stringInt []string
	for _, i := range intArray {
		stringInt = append(stringInt, strconv.Itoa(i))
	}
	return strings.Join(stringInt, "")
}
