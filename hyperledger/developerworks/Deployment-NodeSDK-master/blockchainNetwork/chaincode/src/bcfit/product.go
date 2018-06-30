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
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// ============================================================================================================================
// Create product inventory for seller
// Inputs - sellerId, productID, productName, productCount, productPrice
// ============================================================================================================================
func (t *SimpleChaincode) createProduct(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	return t.updateProduct(stub, args)
}

// ============================================================================================================================
// Update product inventory for seller
// Inputs - sellerId, productID, newProductName, newProductCount, newProductPrice
// ============================================================================================================================
func (t *SimpleChaincode) updateProduct(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments")
	}
	var err error

	//get sellerID from args
	seller_id := args[0]
	//get productID from args
	product_id := args[1]

	//get new product properties from args
	newProductName := args[2]
	newProductCount, err := strconv.Atoi(args[3])
	if err != nil {
		return shim.Error("3rd argument 'productCount' must be a numeric string")
	}
	newProductPrice, err := strconv.Atoi(args[4])
	if err != nil {
		return shim.Error("4th argument 'productPrice' must be a numeric string")
	}

	//get seller
	sellerAsBytes, err := stub.GetState(seller_id)
	if err != nil {
		return shim.Error("Failed to get seller")
	}
	var seller Seller
	json.Unmarshal(sellerAsBytes, &seller)
	if seller.Type != TYPE_SELLER {
		return shim.Error("Not seller type")
	}

	//find the product and update the properties
	productFound := false
	for h := 0; h < len(seller.Products); h++ {
		if seller.Products[h].Id == product_id {
			productFound = true
			seller.Products[h].Name = newProductName
			seller.Products[h].Count = newProductCount
			seller.Products[h].Price = newProductPrice
			break
		}
	}
	//if product not found return error
	if productFound != true {
		var product Product
		product.Id = product_id
		product.Name = newProductName
		product.Count = newProductCount
		product.Price = newProductPrice
		//append product
		seller.Products = append(seller.Products, product)
	}

	//update seller's state
	updatedSellerAsBytes, _ := json.Marshal(seller)
	err = stub.PutState(seller_id, updatedSellerAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//return seller info
	return shim.Success(updatedSellerAsBytes)

}

// ============================================================================================================================
// Get product inventory for seller
// Inputs - sellerId, productID
// ============================================================================================================================
func (t *SimpleChaincode) getProductByID(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments")
	}
	var err error

	//get sellerID, productID from args
	seller_id := args[0]
	product_id := args[1]

	//get seller
	sellerAsBytes, err := stub.GetState(seller_id)
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
		if seller.Products[h].Id == product_id {
			productFound = true
			product = seller.Products[h]
			break
		}
	}

	//if product not found return error
	if productFound != true {
		return shim.Error("Product not found")
	}

	//return product type
	productAsBytes, _ := json.Marshal(product)
	return shim.Success(productAsBytes)

}

// ============================================================================================================================
// Get all products for sale
// Inputs - (none)
// ============================================================================================================================
func (t *SimpleChaincode) getProductsForSale(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	//get sellers array
	sellerIdsBytes, err := stub.GetState("sellerIds")
	if err != nil {
		return shim.Error("Unable to get sellers.")
	}
	var sellerIds []string
	json.Unmarshal(sellerIdsBytes, &sellerIds)

	// create return object array
	type ReturnProductSale struct {
		SellerID  string `json:"sellerid"`
		ProductId string `json:"productid"`
		Name      string `json:"name"`
		Count     int    `json:"count"`
		Price     int    `json:"price"`
	}
	var returnProducts []ReturnProductSale

	//go through all sellerIDs
	for g := 0; g < len(sellerIds); g++ {

		//get seller
		sellerAsBytes, err := stub.GetState(sellerIds[g])
		if err != nil {
			return shim.Error("Failed to get seller")
		}
		var seller Seller
		json.Unmarshal(sellerAsBytes, &seller)

		for h := 0; h < len(seller.Products); h++ {
			if seller.Products[h].Count > 0 {
				var returnProduct ReturnProductSale
				returnProduct.SellerID = seller.Id
				returnProduct.ProductId = seller.Products[h].Id
				returnProduct.Name = seller.Products[h].Name
				returnProduct.Count = seller.Products[h].Count
				returnProduct.Price = seller.Products[h].Price
				//append to array
				returnProducts = append(returnProducts, returnProduct)
			}
		}
	}

	//return products for sole
	returnProductsBytes, _ := json.Marshal(returnProducts)
	return shim.Success(returnProductsBytes)
}
