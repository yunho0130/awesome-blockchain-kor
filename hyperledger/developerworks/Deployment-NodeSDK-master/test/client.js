'use strict';
var Long = require('long');
var resolve = require('path').resolve;
var EventEmitter = require('events').EventEmitter;
var hfc = require('fabric-client');
var CAClient = require('fabric-ca-client');
var CouchDBKeyValueStore = require('./set-up/CouchDBKeyValueStore.js');
var CKS = require('fabric-client/lib/impl/CryptoKeyStore.js');
import enrollUser from './set-up/enroll';
var utils = require('./set-up/utils.js');
process.env.GOPATH = resolve(__dirname, '../chaincode');
const JOIN_TIMEOUT = 120000,
  TRANSACTION_TIMEOUT = 120000;
export class OrganizationClient extends EventEmitter {
  constructor(channelName, ordererConfig, peerConfig, caConfig, admin) {
    super();
    this._channelName = channelName;
    this._ordererConfig = ordererConfig;
    this._peerConfig = peerConfig;
    this._caConfig = caConfig;
    this._admin = admin;
    this._peers = [];
    this._eventHubs = [];
    this._client = new hfc();
    // Setup channel
    this._channel = this._client.newChannel(channelName);
    // Setup orderer and peers
    const orderer = this._client.newOrderer(ordererConfig.url, {
      pem: ordererConfig.pem,
      'ssl-target-name-override': ordererConfig.hostname
    });
    this._channel.addOrderer(orderer);
    const defaultPeer = this._client.newPeer(peerConfig.url, {
      pem: peerConfig.pem,
      'ssl-target-name-override': peerConfig.hostname
    });
    this._peers.push(defaultPeer);
    this._channel.addPeer(defaultPeer);
    this._adminUser = null;
    this._ca = null;
  }
  async login() {
    try {
      await this._client.setStateStore(await CKS(CouchDBKeyValueStore, {
        name: this._peerConfig.stateDBName,
        url: this._peerConfig.stateDBUrl
      }));
      var crypto_suite = hfc.newCryptoSuite();
      var crypto_store = hfc.newCryptoKeyStore(CouchDBKeyValueStore, {
        name: this._peerConfig.userKeystoreDBName,
        url: this._peerConfig.userKeystoreDBUrl
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      var client_crypto_suite = hfc.newCryptoSuite();
      var client_crypto_store = hfc.newCryptoKeyStore(CouchDBKeyValueStore, {
        name: this._peerConfig.userKeystoreDBName,
        url: this._peerConfig.userKeystoreDBUrl
      });
      client_crypto_suite.setCryptoKeyStore(client_crypto_store);
      this._client.setCryptoSuite(client_crypto_suite);
      this._ca = await new CAClient(this._caConfig.url, {
        trustedRoots: [],
        verify: false
      }, this._caConfig.caName, crypto_suite);
      console.log("CA registration complete ");
      this._adminUser = await enrollUser(this._client, "admin", "adminpw", this._ca, {
        mspId: this._caConfig.mspId,
        adminUser: null,
        affiliationOrg: this._peerConfig.org,
        noOfAttempts: 5
      });
      //await this._client.setUserContext(this._adminUser);
      //await this.createOrgAdmin();
    } catch(e) {
      console.log(`Failed to enroll user. Error: ${e.message}`);
      throw e;
    }
  }
  initEventHubs() {
    // Setup event hubs
    try {
      const defaultEventHub = this._client.newEventHub();
      defaultEventHub.setPeerAddr(this._peerConfig.eventHubUrl, {
        pem: this._peerConfig.pem,
        'ssl-target-name-override': this._peerConfig.hostname
      });
      defaultEventHub.connect();
      defaultEventHub.registerBlockEvent(block => {
        this.emit('block', utils.unmarshalBlock(block));
      });
      this._eventHubs.push(defaultEventHub);
    } catch(e) {
      console.log(`Failed to configure event hubs. Error ${e.message}`);
      throw e;
    }
  }
  async createOrgAdmin() {
    return this._client.createUser({
      username: `Admin@${this._peerConfig.hostname}`,
      mspid: this._caConfig.mspId,
      cryptoContent: {
        privateKeyPEM: this._admin.key,
        signedCertPEM: this._admin.cert
      }
    });
  }
  async initialize() {
    try {
      await this._channel.initialize();
    } catch(e) {
      console.log(`Failed to initialize chain. Error: ${e.message}`);
      throw e;
    }
  }
  async createChannel(envelope) {
    const txId = this._client.newTransactionID();
    const channelConfig = this._client.extractChannelConfig(envelope);
    const signature = this._client.signChannelConfig(channelConfig);
    const request = {
      name: this._channelName,
      orderer: this._channel.getOrderers()[0],
      config: channelConfig,
      signatures: [signature],
      txId
    };
    const response = await this._client.createChannel(request);
    // Wait for 5sec to create channel
    //console.log("channel log ");
    //console.log(response);
    await new Promise(resolve => {
      setTimeout(resolve, 5000);
    });
    return response;
  }
  async joinChannel() {
    try {
      const genesisBlock = await this._channel.getGenesisBlock({
        txId: this._client.newTransactionID()
      });
      const request = {
        targets: this._peers,
        txId: this._client.newTransactionID(),
        block: genesisBlock
      };
      const joinedChannelPromises = this._eventHubs.map(eh => {
        eh.connect();
        return new Promise((resolve, reject) => {
          let blockRegistration;
          const cb = block => {
            clearTimeout(responseTimeout);
            eh.unregisterBlockEvent(blockRegistration);
            if(block.data.data.length === 1) {
              const channelHeader = block.data.data[0].payload.header.channel_header;
              if(channelHeader.channel_id === this._channelName) {
                resolve();
              } else {
                reject(new Error('Peer did not join an expected channel.'));
              }
            }
          };
          blockRegistration = eh.registerBlockEvent(cb);
          const responseTimeout = setTimeout(() => {
            eh.unregisterBlockEvent(blockRegistration);
            reject(new Error('Peer did not respond in a timely fashion!'));
          }, JOIN_TIMEOUT);
        });
      });
      const completedPromise = joinedChannelPromises.concat([
        this._channel.joinChannel(request)
      ]);
      await Promise.all(completedPromise);
    } catch(e) {
      console.log(`Error joining peer to channel. Error: ${e.message}`);
      throw e;
    }
  }
  async checkChannelMembership() {
    try {
      const {
        channels
      } = await this._client.queryChannels(this._peers[0]);
      if(!Array.isArray(channels)) {
        return false;
      }
      return channels.some(({
        channel_id
      }) => channel_id === this._channelName);
    } catch(e) {
      return false;
    }
  }
  async checkInstalled(chaincodeId, chaincodeVersion, chaincodePath) {
    let {
      chaincodes
    } = await this._channel.queryInstantiatedChaincodes();
    if(!Array.isArray(chaincodes)) {
      return false;
    }
    return chaincodes.some(cc => cc.name === chaincodeId && cc.path === chaincodePath && cc.version === chaincodeVersion);
  }
  async install(chaincodeId, chaincodeVersion, chaincodePath) {
    const request = {
      targets: this._peers,
      chaincodePath,
      chaincodeId,
      chaincodeVersion
    };
    // Make install proposal to all peers
    let results;
    try {
      results = await this._client.installChaincode(request);
    } catch(e) {
      console.log(`Error sending install proposal to peer! Error: ${e.message}`);
      throw e;
    }
    const proposalResponses = results[0];
    const allGood = proposalResponses.every(pr => pr.response && pr.response.status == 200);
    return allGood;
  }
  async instantiate(chaincodeId, chaincodeVersion, chaincodePath, ...args) {
    let proposalResponses, proposal;
    const txId = this._client.newTransactionID();
    try {
      const request = {
        chaincodeType: 'golang',
        chaincodePath,
        chaincodeId,
        chaincodeVersion,
        fcn: 'init',
        args: utils.marshalArgs(args),
        txId
      };
      const results = await this._channel.sendInstantiateProposal(request, 100000);
      proposalResponses = results[0];
      proposal = results[1];
      let allGood = proposalResponses.every(pr => pr.response && pr.response.status == 200);
      if(!allGood) {
        throw new Error(`Proposal rejected by some (all) of the peers: ${proposalResponses}`);
      }
    } catch(e) {
      throw e;
    }
    try {
      const request = {
        proposalResponses,
        proposal
      };
      const deployId = txId.getTransactionID();
      const transactionCompletePromises = this._eventHubs.map(eh => {
        eh.connect();
        return new Promise((resolve, reject) => {
          // Set timeout for the transaction response from the current peer
          const responseTimeout = setTimeout(() => {
            eh.unregisterTxEvent(deployId);
            reject(new Error('Peer did not respond in a timely fashion!'));
          }, TRANSACTION_TIMEOUT);
          eh.registerTxEvent(deployId, (tx, code) => {
            clearTimeout(responseTimeout);
            eh.unregisterTxEvent(deployId);
            if(code != 'VALID') {
              reject(new Error(`Peer has rejected transaction with code: ${code}`));
            } else {
              resolve();
            }
          });
        });
      });
      transactionCompletePromises.push(this._channel.sendTransaction(request));
      await transactionCompletePromises;
    } catch(e) {
      throw e;
    }
  }
  async getBlocks(currentBlock, noOfLastBlocks) {
    if(currentBlock === 0) {
      return [];
    }
    if(!currentBlock) {
      currentBlock = -1;
    }
    if(!noOfLastBlocks) {
      noOfLastBlocks = 10;
    }
    currentBlock = typeof currentBlock !== 'number' ? Number(currentBlock) : currentBlock;
    noOfLastBlocks = typeof noOfLastBlocks !== 'number' ? Number(noOfLastBlocks) : noOfLastBlocks;
    var {
      height
    } = await this._channel.queryInfo();
    if(currentBlock == -1) {
      currentBlock = height;
    }
    if(height.comp(currentBlock) >= 0) {
      height = Long.fromNumber(currentBlock, height.unsigned);
    }
    let blockCount;
    if(height.comp(noOfLastBlocks) > 0) {
      blockCount = Long.fromNumber(noOfLastBlocks, height.unsigned);
    } else {
      blockCount = height;
    }
    blockCount = blockCount.toNumber();
    const queryBlock = this._channel.queryBlock.bind(this._channel);
    const blockPromises = {};
    blockPromises[Symbol.iterator] = function* () {
      for(let i = 1; i <= blockCount; i++) {
        yield queryBlock(height.sub(i).toNumber());
      }
    };
    const blocks = await Promise.all([...blockPromises]);
    return blocks.map(utils.unmarshalBlock);
  }
  async registerAndEnroll(enrollmentID) {
    try {
      if(!enrollmentID && enrollmentID === "") {
        throw new Error(`Invalid User Id`);
      }
      //let adminUser = await this._client.getUserContext('admin', true);
      let adminUser = this._adminUser;
      if(!adminUser && !adminUser.isEnrolled()) {
        throw new Error(`Admin user not present to register user : ` + enrollmentID);
      }
      return enrollUser(this._client, enrollmentID, "", this._ca, {
        mspId: this._caConfig.mspId,
        adminUser: adminUser,
        affiliationOrg: this._peerConfig.org,
        noOfAttempts: 3
      });
    } catch(e) {
      throw e;
    }
  }
  async getTransactionDetails(txId) {
    try {
      var transactionData = await this._channel.queryTransaction(txId);
      transactionData = transactionData ? transactionData.transactionEnvelope.payload.data.actions : "";
      var execution_response = transactionData !== "" ? transactionData[0].payload.action.proposal_response_payload.extension.response : "";
      return {
        txId: txId,
        results: execution_response
      };
    } catch(e) {
      throw e;
    }
  }
}