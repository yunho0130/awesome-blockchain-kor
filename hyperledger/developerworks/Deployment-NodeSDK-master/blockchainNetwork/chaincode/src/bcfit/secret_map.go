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

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

//steps to fitcoin constant
const STEPS_TO_FITCOIN = 100

//contract state
const STATE_COMPLETE = "complete"
const STATE_PENDING = "pending"
const STATE_DECLINED = "declined"

//member type
const TYPE_USER = "user"
const TYPE_SELLER = "seller"

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

// Member object for participants
type Member struct {
	Id              string `json:"id"`
	Type            string `json:"memberType"`
	FitcoinsBalance int    `json:"fitcoinsBalance"`
}

// User
type User struct {
	Member
	TotalSteps             int      `json:"totalSteps"`
	StepsUsedForConversion int      `json:"stepsUsedForConversion"`
	ContractIds            []string `json:"contractIds"`
}

// Seller
type Seller struct {
	Member
	Products []Product `json:"products"`
}

// Product
type Product struct {
	Id    string `json:"id"`
	Name  string `json:"name"`
	Count int    `json:"count"`
	Price int    `json:"price"`
}

// Contract
type Contract struct {
	Id          string `json:"id"`
	SellerId    string `json:"sellerId"`
	UserId      string `json:"userId"`
	ProductId   string `json:"productId"`
	ProductName string `json:"productName"`
	Quantity    int    `json:"quantity"`
	Cost        int    `json:"cost"`
	State       string `json:"state"`
}

// ============================================================================================================================
// Main
// ============================================================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting chaincode: %s", err)
	}
}

// ============================================================================================================================
// Init - initialize the chaincode
// ============================================================================================================================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {

	//store sellerIds
	var sellerIds []string
	sellerIdsBytes, err := json.Marshal(sellerIds)
	if err != nil {
		return shim.Error("Error initializing sellers.")
	}
	err = stub.PutState("sellerIds", sellerIdsBytes)

	return shim.Success(nil)
}

// ============================================================================================================================
// Invoke - Our entry point for Invocations
// ============================================================================================================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println(" ")
	fmt.Println("starting invoke, for - " + function)

	//call functions
	if function == "createMember" {
		return t.createMember(stub, args)
	} else if function == "generateFitcoins" {
		return t.generateFitcoins(stub, args)
	} else if function == "getState" {
		return t.getState(stub, args)
	} else if function == "createProduct" {
		return t.createProduct(stub, args)
	} else if function == "updateProduct" {
		return t.updateProduct(stub, args)
	} else if function == "getProductByID" {
		return t.getProductByID(stub, args)
	} else if function == "getProductsForSale" {
		return t.getProductsForSale(stub, args)
	} else if function == "makePurchase" {
		return t.makePurchase(stub, args)
	} else if function == "transactPurchase" {
		return t.transactPurchase(stub, args)
	} else if function == "getAllUserContracts" {
		return t.getAllUserContracts(stub, args)
	} else if function == "getAllContracts" {
		return t.getAllContracts(stub, args)
	}

	return shim.Error("Function with the name " + function + " does not exist.")
}

// ============================================================================================================================
// Get state with userId, sellerID, contractID
// Inputs - id
// ============================================================================================================================
func (t *SimpleChaincode) getState(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments")
	}

	//get id
	id := args[0]

	// Get the state from the ledger
	dataAsBytes, err := stub.GetState(id)
	if err != nil {
		return shim.Error("Failed to get state")
	}

	//return user info
	return shim.Success(dataAsBytes)
}
