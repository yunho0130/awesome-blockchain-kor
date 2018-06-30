'use strict';
import config from './config.js';
import {
  OrganizationClient
} from './client';
import invokeFunc from './set-up/invoke';
import queryFunc from './set-up/query';
const shopClient = new OrganizationClient(config.channelName, config.orderer, config.peers[0].peer, config.peers[0].ca, config.peers[0].admin);
(async () => {
  try {
    await Promise.all([shopClient.login()]);
  } catch(e) {
    console.log('Fatal error logging into blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }
  await Promise.all([shopClient.initEventHubs()]);
  var results = await invokeFunc("admin", shopClient, config.chaincodeId, config.chaincodeVersion, "createMember", ["userA", "user"]);
  console.log("Invoke Results:");
  console.log(results);
  results = await queryFunc("admin", shopClient, config.chaincodeId, config.chaincodeVersion, "getState", ["userA"])
  console.log("Query Results:");
  console.log(results);
})();