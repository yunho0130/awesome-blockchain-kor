## Chaincode Functions

This document goes through all the functions in the chaincode. All chaincode function calls are through an input json. The json consists of the following attributes:

* type - enroll, invoke or query
* userID - id to call the function
* fcn - function name
* args - array of string


### Create user and seller

#### Enroll member call
```
var input = {
  type: enroll,
  params: {}
}
```
- return memberID

#### Create user
```
var input = {
  type: invoke,
  params: {
    userId: memberID,
    fcn: createMember
    args: memberID, user
  }
}
```
- memberID - the id created for user
- user - "user" string must be second arg

#### Create seller
```
var input = {
  type: invoke,
  params: {
    userId: memberID
    fcn: createMember
    args: memberID, seller
  }
}
```
- memberID - the id created for seller
- user - "seller" string must be second arg

### User invoke calls

The invoke calls from user's iOS app which update the blockchain state.

#### Generate fitcoins
```
input = {
  type: invoke,
  params: {
    userId: userId
    fcn: generateFitcoins
    args: userId, totalSteps
  }
}
```
- userID - the user ID returned from enroll
- totalSteps - the total steps walked by user

#### Make purchase
```
input = {
  type: invoke,
  params: {
    userId: userId,
    fcn: makePurchase
    args: userId, sellerId, productId, quantity
  }
}
```

- sellerID - the seller's ID
- userID
- productID - the id of product with seller, picked by user through interface
- quantity - picked by user through interface


### Seller invoke calls

The invoke calls from seller dashboard which update the blockchain state.

#### Create product inventory
```
var input = {
  type: invoke,
  params: {
    userId: sellerID
    fcn: createProduct
    args: sellerID, productID, productName, productCount productPrice
  }
}
```
- sellerID - the seller's ID returned from enroll
- productID - product property: the id of product with seller
- productName - product property: the name of product
- productCount - product property: the count of product
- productPrice - product price: the price of product

#### Update product inventory
```
var input = {
  type: invoke,
  params: {
    userId: sellerID
    fcn: updateProduct
    args: sellerID, productID, productName, productCount productPrice
  }
}
```
- sellerID - the seller's ID returned from enroll
- productID - product property: the id of product with seller
- productName - product property: the name of product
- productCount - product property: the count of product
- productPrice - product price: the price of product

### User or Seller invoke calls

User or seller can call transact purchase.  Only seller can complete the transaction while both seller and user can decline the transaction

#### Transact purchase
```
var input = {
  type: invoke,
  params: {
    userId: memberID
    fcn: transactPurchase
    args: memberID, contractID, newState(complete or declined)
  }
}
```

- memberID - the id of user or seller calling the function
- contractID - the contract ID generated when user perform 'makePurchase'
- newState - must be "declined" or "complete". Only the sellerID on the contract can make the "complete" call


### Query calls

The calls that read data from blockchain state database.

#### Get State
Gets state with userId, sellerID or contractID as args
```
var input = {
  type: query,
  params: {
    userId: userID
    fcn: getState
    args: id userId, sellerID or contractID
  }
}
```
- id - must be a userId, sellerID or contractID

#### Get products for sale
Gets array of products available with sellerID
```
var input = {
  type: query,
  params: {
    userId: userID
    fcn: getProductsForSale
    args: (none)
  }
}
```

#### Get all user's contracts
Get user's contracts, for all the purchases made
```
var input = {
  type: query,
  params: {
    userId: userID,
    fcn: getAllContracts
    args: userID
  }
}
```
- userID - the user's ID

#### Get all contracts
Gets all contracts
```
var input = {
  type: query,
  params: {
    userId: userID,
    fcn: getAllContracts
    args: (none)
  }
}
```
