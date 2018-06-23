*Read this in other languages: [한국어](README-ko.md), [中国](README-cn.md).*
# BlockchainNetwork-CompositeJourney

## Build Your First Network (BYFN)

Welcome to the first in a series of building a Blockchain application. **Part 1** will show you how to create a Hyperledger Composer Business Network Archive (BNA) file for Commodity trade and deploy it on a Hyperledger Fabric. This will be the "Hello World" of Hyperledger Composer samples so beginner developers should be able to manage this. This pattern has been updated to support Hyperledger Composer V0.19.5, Hyperledger Fabric V1.1.

Hyperledger Fabric is a blockchain framework implementation and one of the Hyperledger projects hosted by The Linux Foundation. Intended as a foundation for developing applications or solutions with a modular architecture, Hyperledger Fabric allows components, such as consensus and membership services, to be plug-and-playIn

[Part 2](https://github.com/IBM/BlockchainBalanceTransfer-CompositeJourney), we will explore more about creating a complex network with multiple participants and using Access Control Rules (ACL) to provide them network access permissions. In this journey, you will run Hyperledger Fabric locally.

You can use [Hyperledger Composer](https://github.com/hyperledger/composer) to quickly model your current business network, containing your existing assets and the transactions related to them. Assets are tangible or intangible goods, services, or property. As part of your business network model, you define the transactions which can interact with assets. Business networks also include the participants who interact with them, each of which can be associated with a unique identity, across multiple business networks. A business network definition consists of model(.cto), script(.js) and ACL(.acl) files packaged and exported as an archive(.bna file). The archive file is then deployed to a Hyperledger Fabric network.

## Included Components
* Hyperledger Fabric
* Hyperledger Composer
* Docker

## Application Workflow Diagram
![Application Workflow](images/arch-blockchain-network1.png)

1. Install the Network Dependicies a) cryptogen b) configtxgen c) configtxlator d) peer
2. Configure the network a) generating the network artifacts b) Starting up the network

## Prerequisites

* [Docker](https://www.docker.com/products/overview) - v1.13 or higher
* [Docker Compose](https://docs.docker.com/compose/overview/) - v1.8 or higher
* [Node.js & npm](https://nodejs.org/en/download/) - node v8.11.2
* [Git client](https://git-scm.com/downloads) - needed for clone commands
*  git - 2.9.x
*  Python - 2.7.x

## Steps
1. [Installing Hyperledger Composer Development Tools](#1-installing-hyperledger-composer-development-tools)
2. [Starting Hyperledger Fabric](#2-starting-hyperledger-fabric)
3. [Generate the Business Network Archive (BNA)](#3-generate-the-business-network-archive-bna)
4. [Deploy the Business Network Archive using Composer Playground](#4-deploy-the-business-network-archive-using-composer-playground)
5. [Deploy the Business Network Archive on Hyperledger Composer running locally](#5-deploy-the-business-network-archive-on-hyperledger-composer-running-locally)

## 1. Installing Hyperledger Composer Development Tools

**Note:** You may need to run these commands in superuser `sudo` mode. `sudo` allows a permitted user to execute a command as the superuser or another user, as specified by the security policy. Additionally, you will be installing the latest version of composer-cli (0.19.5).  If you have an older version installed, go ahead and remove it by using the command:

```
npm uninstall -g composer-cli
```

* The `composer-cli` contains all the command line operations for developing business networks. To install `composer-cli` run the following command:
```
npm install -g composer-cli@0.19.5
```

* The `generator-hyperledger-composer` is a Yeoman plugin that creates bespoke (e.g. customized) applications for your business network. Yeoman is an open source client-side development stack, consisting of tools and frameworks intended to help developers build web applications. To install `generator-hyperledger-composer` run the following command:
```
npm install -g generator-hyperledger-composer@0.19.5
```

* The `composer-rest-server` uses the Hyperledger Composer LoopBack Connector to connect to a business network, extract the models and then present a page containing the REST APIs that have been generated for the model. To install `composer-rest-server` run the following command:
```
npm install -g composer-rest-server@0.19.5
```

* When combining `Yeoman` with the `generator-hyperledger-composer` component, it can interpret business networks and generate applications based on them. To install `Yeoman` run the following command:
```
npm install -g yo@2.0.0
```

## 2. Starting Hyperledger Fabric

First download the docker files for Fabric in preparation for creating a Composer profile.  Hyperledger Composer uses Connection Profiles to connect to a runtime. A Connection Profile is a JSON document that lives in the user's home directory (or may come from an environment variable) and is referenced by name when using the Composer APIs or the Command Line tools. Using connection profiles ensures that code and scripts are easily portable from one runtime instance to another.

The PeerAdmin card is a special ID card used to administer the local Hyperledger Fabric. In a development installation, such as the one on your computer, the PeerAdmin ID card is created when you install the local Hyperledger Fabric.

The form for a PeerAdmin card for a Hyperledger Fabric v1.0 network is PeerAdmin@hlfv1.  In general, the PeerAdmin is a special role reserved for functions such as:

* Deploying business networks
* Creating, issuing, and revoking ID cards for business network admins*

First, clone the contents of this repo locally and cd into the project folder by running these commands:

```bash
git clone https://github.com/IBM/BlockchainNetwork-CompositeJourney.git

cd BlockchainNetwork-CompositeJourney
```

Then, start the Fabric and create a Composer profile using the following commands:
```bash
./downloadFabric.sh
./startFabric.sh
./createPeerAdminCard.sh
```  

No need to do it now; however as an fyi - you can stop and tear down Fabric using:
```
./stopFabric.sh
./teardownFabric.sh
```

## 3. Generate the Business Network Archive (BNA)

This business network defines:

**Participant**
`Trader`

**Asset**
`Commodity`

**Transaction**
`Trade`

`Commodity` is owned by a `Trader`, and the owner of a `Commodity` can be modified by submitting a `Trade` transaction.

The next step is to generate a Business Network Archive (BNA) file for your business network definition. The BNA file is the deployable unit -- a file that can be deployed to the Composer runtime for execution.

Use the following command to generate the network archive:
```bash
npm install
```
You should see the following output:
```bash
Creating Business Network Archive

Looking for package.json of Business Network Definition
	Input directory: /Users/ishan/Documents/git-demo/BlockchainNetwork-CompositeJourney

Found:
	Description: Sample Trade Network
	Name: my-network
	Identifier: my-network@0.0.1

Written Business Network Definition Archive file to
	Output file: ./dist/my-network.bna

Command succeeded
```

The `composer archive create` command has created a file called `my-network.bna` in the `dist` folder.

You can test the business network definition against the embedded runtime that stores the state of 'the blockchain' in-memory in a Node.js process. This embedded runtime is very useful for unit testing, as it allows you to focus on testing the business logic rather than configuring an entire Fabric.
From your project working directory(`BlockchainNetwork-CompositeJourney`), run the command:
```
npm test
```

You should see the following output:
```bash

> my-network@0.0.1 test /Users/laurabennett/2017-NewRole/Code/BlockchainNetwork-CompositeJourney
> mocha --recursive

Commodity Trading
    #tradeCommodity
      ✓ should be able to trade a commodity (198ms)


  1 passing (1s)
```

## 4. Deploy the Business Network Archive using Composer Playground

Open [Composer Playground](http://composer-playground.mybluemix.net/), by default the Basic Sample Network is imported.
If you have previously used Playground, be sure to clear your browser local storage by running `localStorage.clear()` in your browser Console.

Now import the `my-network.bna` file and click on deploy button.  If you don't know how to import, take a [tour of Composer Playground](https://www.youtube.com/watch?time_continue=29&v=JQMh_DQ6wXc)


>You can also setup [Composer Playground locally](https://hyperledger.github.io/composer/latest/installing/development-tools.html).

You will see the following:
<p align="center">
  <img width="400" height="200" src="images/ComposerPlayground.jpg">
</p>

To test your Business Network Definition, first click on the **Test** tab:

Click on the `Create New Participant` button
<p align="center">
  <img width="200" height="100" src="images/createparticipantbtn.png">
</p>


Create `Trader` participants:

```
{
  "$class": "org.acme.mynetwork.Trader",
  "tradeId": "traderA",
  "firstName": "Tobias",
  "lastName": "Funke"
}
```
```
{
  "$class": "org.acme.mynetwork.Trader",
  "tradeId": "traderB",
  "firstName": "Simon",
  "lastName": "Stone"
}
```

Highlight the Commodity tab on the far left hand side and
create a `Commodity` asset with owner as `traderA`:
```
{
  "$class": "org.acme.mynetwork.Commodity",
  "tradingSymbol": "commodityA",
  "description": "Sample Commodity",
  "mainExchange": "Dollar",
  "quantity": 100,
  "owner": "resource:org.acme.mynetwork.Trader#traderA"
}
```

Click on the `Submit Transaction` button on the lower left-hand side and submit a `Trade` transaction to change the owner of Commodity `commodityA`:
```
{
  "$class": "org.acme.mynetwork.Trade",
  "commodity": "resource:org.acme.mynetwork.Commodity#commodityA",
  "newOwner": "resource:org.acme.mynetwork.Trader#traderB"
}
```

You can verify the new owner by clicking on the `Commodity` registry. Also you can view all the transactions by selecting the `All Transactions` registry.

Example of transaction view:
<p align="center">
  <img width="400" height="200" src="images/transactionsview.png">
</p>

## 5. Deploy the Business Network Archive on Hyperledger Composer running locally (alternative deployment approach)

Deploying a business network to the Hyperledger Fabric requires the Hyperledger Composer chaincode to be installed on the peer, then the business network archive (.bna) must be sent to the peer, and a new participant, identity, and associated card must be created to be the network administrator. Finally, the network administrator business network card must be imported for use, and the network can then be pinged to check it is responding.

Change directory to the `dist` folder containing `my-network.bna` file.

The `composer network install` command requires a PeerAdmin business network card (in this case one has been created and imported in advance), and the name of the business network. To install the composer runtime, run the following command:
```
cd dist
composer network install --card PeerAdmin@hlfv1 --archiveFile my-network.bna
```

The `composer network start` command requires a business network card, as well as the name of the admin identity for the business network, the file path of the `.bna` and the name of the file to be created ready to import as a business network card. To deploy the business network, run the following command:
```
composer network start --networkName my-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
```

The `composer card import` command requires the filename specified in `composer network start` to create a card. To import the network administrator identity as a usable business network card, run the following command:
```
composer card import --file networkadmin.card
```

You can verify that the network has been deployed by typing:
```
composer network ping --card admin@my-network
```

You should see the the output as follows:
```
The connection to the network was successfully tested: my-network
	version: 0.19.0
	participant: org.hyperledger.composer.system.Identity#82c679fbcb1541eafeff1bc71edad4f2c980a0e17a5333a6a611124c2addf4ba

Command succeeded
```

To integrate with the deployed business network (creating assets/participants and submitting transactions) we can either use the Composer Node SDK or we can generate a REST API. To create the REST API we need to launch the `composer-rest-server` and tell it how to connect to our deployed business network. Now launch the server by changing directory to the project working directory and type:
```bash
cd ..
composer-rest-server
```

Answer the questions posed at startup. These allow the composer-rest-server to connect to Hyperledger Fabric and configure how the REST API is generated.
* Enter `admin@my-network` as the card name.
* Select `never use namespaces` when asked whether to use namespaces in the generated API.
* Select `No` when asked whether to secure the generated API.
* Select `No` when asked whether to enable authentication with Passport.
* Select `Yes` when asked whether to enable event publication.
* Select `No` when asked whether to enable TLS security.

If the composer-rest-server started successfully you should see these two lines are output:
```
Discovering types from business network definition ...
Discovered types from business network definition
Generating schemas for all types in business network definition ...
Generated schemas for all types in business network definition
Adding schemas for all types to Loopback ...
Added schemas for all types to Loopback
Web server listening at: http://localhost:3000
Browse your REST API at http://localhost:3000/explorer
```

Open a web browser and navigate to http://localhost:3000/explorer

You should see the LoopBack API Explorer, allowing you to inspect and test the generated REST API. Follow the instructions to test Business Network Definition as mentioned above in the composer section.

## Ready to move to Step 2!
Congratulations - you have completed Step 1 of this Composite Journey - move onto [Step 2](https://github.com/IBM/BlockchainBalanceTransfer-CompositeJourney).

## Additional Resources
* [Hyperledger Fabric Docs](http://hyperledger-fabric.readthedocs.io/en/latest/)

## License
[Apache 2.0](LICENSE)
