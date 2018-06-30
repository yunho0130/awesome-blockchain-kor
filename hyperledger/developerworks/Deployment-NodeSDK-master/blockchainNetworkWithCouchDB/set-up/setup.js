'use strict';
import config from './config';
import {
  OrganizationClient
} from './client';
import http from 'http';
import url from 'url';
// Setup clients per organization
const clients = config.peers.map(obj => new OrganizationClient(config.channelName, config.orderer, obj.peer, obj.ca, obj.admin));

function getAdminOrgs() {
  return Promise.all(clients.map(client => client.createOrgAdmin()));
}
(async () => {
  try {
    await Promise.all(clients.map(client => client.login()));
  } catch(e) {
    console.log('Fatal error logging into blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }
  // Setup event hubs
  clients.map(client => client.initEventHubs());
  try {
    await getAdminOrgs();
    if(!(await clients[0].checkChannelMembership())) {
      console.log('Default channel not found, attempting creation...');
      const createChannelResponse = await clients[0].createChannel(config.channelConfig);
      if(createChannelResponse.status === 'SUCCESS') {
        console.log('Successfully created a new default channel.');
        console.log('Joining peers to the default channel.');
        await Promise.all(clients.map(client => client.joinChannel()));
        // Wait for 10s for the peers to join the newly created channel
        await new Promise(resolve => {
          setTimeout(resolve, 10000);
        });
      }
    }
  } catch(e) {
    console.log('Fatal error bootstrapping the blockchain network!');
    console.log(e);
    process.exit(-1);
  }
  // Initialize network
  try {
    await Promise.all(clients.map(client => client.initialize()));
  } catch(e) {
    console.log('Fatal error initializing blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }
  // Install chaincode on all peers
  let installedOnClients;
  try {
    await getAdminOrgs();
    installedOnClients = await Promise.all(clients.map(client => client.checkInstalled(config.chaincodeId, config.chaincodeVersion, config.chaincodePath)));
  } catch(e) {
    console.log('Fatal error getting installation status of the chaincode!');
    console.log(e);
    process.exit(-1);
  }
  let check = installedOnClients.every(installed => installed);
  if(!(check)) {
    console.log('Chaincode is not installed, attempting installation...');
    // Pull chaincode environment base image
    try {
      await getAdminOrgs();
      const socketPath = process.env.DOCKER_SOCKET_PATH || (process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock');
      const ccenvImage = process.env.DOCKER_CCENV_IMAGE || 'hyperledger/fabric-ccenv:x86_64-1.1.0';
      const listOpts = {
        socketPath,
        method: 'GET',
        path: '/images/json'
      };
      const pullOpts = {
        socketPath,
        method: 'POST',
        path: url.format({
          pathname: '/images/create',
          query: {
            fromImage: ccenvImage
          }
        })
      };
      const images = await new Promise((resolve, reject) => {
        const req = http.request(listOpts, (response) => {
          let data = '';
          response.setEncoding('utf-8');
          response.on('data', chunk => {
            data += chunk;
          });
          response.on('end', () => {
            resolve(JSON.parse(data));
          });
        });
        req.on('error', reject);
        req.end();
      });
      const imageExists = images.some(i => i.RepoTags && i.RepoTags.some(tag => tag === ccenvImage));
      if(!imageExists) {
        console.log('Base container image not present, pulling from Docker Hub...');
        await new Promise((resolve, reject) => {
          const req = http.request(pullOpts, (response) => {
            response.on('data', () => {});
            response.on('end', () => {
              resolve();
            });
          });
          req.on('error', reject);
          req.end();
        });
        console.log('Base container image downloaded.');
      } else {
        console.log('Base container image present.');
      }
    } catch(e) {
      console.log('Fatal error pulling docker images.');
      console.log(e);
      process.exit(-1);
    }
    try {
      await Promise.all(clients.map(client => client.install(config.chaincodeId, config.chaincodeVersion, config.chaincodePath)));
      await new Promise(resolve => {
        setTimeout(resolve, 10000);
      });
      console.log('Successfully installed chaincode on the default channel.');
    } catch(e) {
      console.log('Fatal error installing chaincode on the Peer!');
      console.log(e);
      process.exit(-1);
    }
  } else {
    console.log('Chaincode already installed on the blockchain network.');
  }
  // Instantiate chaincode on all peers
  // Instantiating the chaincode on a single peer should be enough (for now)
  try {
    await clients[0].instantiate(config.chaincodeId, config.chaincodeVersion, config.chaincodePath, '{"Args":[""]}');
    console.log('Successfully instantiated chaincode on all peers.');
  } catch(e) {
    console.log('Fatal error instantiating chaincode on some(all) peers!');
    console.log(e);
    process.exit(-1);
  }
  
})();
// Export organization clients
/*export {
  shopClient,
  fitcoinClient
};*/
