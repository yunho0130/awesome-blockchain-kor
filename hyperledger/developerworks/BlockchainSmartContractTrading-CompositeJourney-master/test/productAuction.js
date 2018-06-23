/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
/**
 * Write the unit tests for your transction processor functions here
 */
const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const {
  BusinessNetworkDefinition,
  CertificateUtil,
  IdCard
} = require('composer-common');
const path = require('path');
const chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));
const namespace = 'org.acme.product.auction';
describe('#' + namespace, () => {
  // In-memory card store for testing so cards are not persisted to the file system
  const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore({
    type: 'composer-wallet-inmemory'
  });
  // Embedded connection used for local testing
  const connectionProfile = {
    name: 'embedded',
    'x-type': 'embedded'
  };
  // Name of the business network card containing the administrative identity for the business network
  const adminCardName = 'admin';
  // Admin connection to the blockchain, used to deploy the business network
  let adminConnection;
  // This is the business network connection the tests will use.
  let businessNetworkConnection;
  // This is the factory for creating instances of types.
  let factory;
  // These are the identities for Alice and Bob.
  const danielCardName = 'daniel';
  const simonCardName = 'simon';
  const matthewCardName = 'matthew';
  // These are a list of receieved events.
  let events;
  let businessNetworkName;
  before(async () => {
    // Generate certificates for use with the embedded connection
    const credentials = CertificateUtil.generate({
      commonName: 'admin'
    });
    // Identity used with the admin connection to deploy business networks
    const deployerMetadata = {
      version: 1,
      userName: 'PeerAdmin',
      roles: ['PeerAdmin', 'ChannelAdmin']
    };
    const deployerCard = new IdCard(deployerMetadata, connectionProfile);
    deployerCard.setCredentials(credentials);
    const deployerCardName = 'PeerAdmin';
    adminConnection = new AdminConnection({
      cardStore: cardStore
    });
    await adminConnection.importCard(deployerCardName, deployerCard);
    await adminConnection.connect(deployerCardName);
  });
  /**
   *
   * @param {String} cardName The card name to use for this identity
   * @param {Object} identity The identity details
   */
  async function importCardForIdentity(cardName, identity) {
    const metadata = {
      userName: identity.userID,
      version: 1,
      enrollmentSecret: identity.userSecret,
      businessNetwork: businessNetworkName
    };
    const card = new IdCard(metadata, connectionProfile);
    await adminConnection.importCard(cardName, card);
  }
  // This is called before each test is executed.
  beforeEach(async () => {
    // Generate a business network definition from the project directory.
    let businessNetworkDefinition = await BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
    businessNetworkName = businessNetworkDefinition.getName();
    await adminConnection.install(businessNetworkDefinition);
    const startOptions = {
      networkAdmins: [{
        userName: 'admin',
        enrollmentSecret: 'adminpw'
      }]
    };
    const adminCards = await adminConnection.start(businessNetworkName, businessNetworkDefinition.getVersion(), startOptions);
    await adminConnection.importCard(adminCardName, adminCards.get('admin'));
    // Create and establish a business network connection
    businessNetworkConnection = new BusinessNetworkConnection({
      cardStore: cardStore
    });
    events = [];
    businessNetworkConnection.on('event', event => {
      events.push(event);
    });
    await businessNetworkConnection.connect(adminCardName);
    // Get the factory for the business network.
    const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    // create the auctioneer
    const seller = factory.newResource(namespace, 'Seller', 'daniel.selman@example.com');
    seller.organisation = 'XYZ Corp';
    seller.balance = 0;
    seller.products = [];
    // create potential buyers
    const buyer = factory.newResource(namespace, 'Member', 'sstone1@example.com');
    buyer.firstName = 'Simon';
    buyer.lastName = 'Stone';
    buyer.balance = 100;
    buyer.products = [];
    const buyer2 = factory.newResource(namespace, 'Member', 'whitemat@example.com');
    buyer2.firstName = 'Matthew';
    buyer2.lastName = 'White';
    buyer2.balance = 10000;
    buyer2.products = [];
    const sellerNS = namespace + '.Seller';
    const buyerNS = namespace + '.Member';
    const sellerRegistry = await businessNetworkConnection.getParticipantRegistry(sellerNS);
    const buyerRegistry = await businessNetworkConnection.getParticipantRegistry(buyerNS);
    await sellerRegistry.add(seller);
    await buyerRegistry.addAll([buyer, buyer2]);
    let identity = await businessNetworkConnection.issueIdentity(sellerNS + '#daniel.selman@example.com', 'daniel');
    await importCardForIdentity(danielCardName, identity);
    identity = await businessNetworkConnection.issueIdentity(buyerNS + '#sstone1@example.com', 'simon');
    await importCardForIdentity(simonCardName, identity);
    identity = await businessNetworkConnection.issueIdentity(buyerNS + '#whitemat@example.com', 'matthew');
    await importCardForIdentity(matthewCardName, identity);
    await useIdentity(danielCardName);
    //const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    const product = factory.newTransaction(namespace, 'AddProduct');
    product.description = 'My nice car';
    product.productId = 'p1';
    product.owner = factory.newRelationship(namespace, 'Seller', 'daniel.selman@example.com');
    // Get the asset registry.
    await businessNetworkConnection.submitTransaction(product);
    //const sellerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Seller');
    const sellerReg = await sellerRegistry.get('daniel.selman@example.com');
    sellerReg.products.length.should.equal(1);
  });
  /**
   * Reconnect using a different identity.
   * @param {String} cardName The name of the card for the identity to use
   */
  async function useIdentity(cardName) {
    await businessNetworkConnection.disconnect();
    businessNetworkConnection = new BusinessNetworkConnection({
      cardStore: cardStore
    });
    events = [];
    businessNetworkConnection.on('event', (event) => {
      events.push(event);
    });
    await businessNetworkConnection.connect(cardName);
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();
  }
  it('Authorized owner should start the bidding', async () => {
    await useIdentity(danielCardName);
    const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    // create the auctioneer
    const sellerId = 'daniel.selman@example.com';
    const sellerNS = namespace + '.Seller';
    const sellerRegistry = await businessNetworkConnection.getParticipantRegistry(sellerNS);
    const seller = await sellerRegistry.get('daniel.selman@example.com');
    var productid = seller.products[0].getIdentifier();
    const listing = factory.newTransaction(namespace, 'StartBidding');
    listing.listingId = 'l1';
    listing.reservePrice = 50;
    listing.product = factory.newRelationship(namespace, 'Product', productid);
    await businessNetworkConnection.submitTransaction(listing);
    const productListingRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.ProductListing');
    const assets = await productListingRegistry.getAll();
    assets.should.have.lengthOf(1);
  });
  it('Members bid for the product', async () => {
    await useIdentity(danielCardName);
    const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    const sellerId = 'daniel.selman@example.com';
    const sellerNS = namespace + '.Seller';
    const sellerRegistry = await businessNetworkConnection.getParticipantRegistry(sellerNS);
    const seller = await sellerRegistry.get('daniel.selman@example.com');
    var productid = seller.products[0].getIdentifier();
    const listing = factory.newTransaction(namespace, 'StartBidding');
    listing.listingId = 'l1';
    listing.reservePrice = 50;
    listing.product = factory.newRelationship(namespace, 'Product', productid);
    await businessNetworkConnection.submitTransaction(listing);
    const productListingRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.ProductListing');
    const assets = await productListingRegistry.getAll();
    assets.should.have.lengthOf(1);
    var assetId = assets[0].getIdentifier();
    var buyerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Member');
    await useIdentity(simonCardName);
    var offer = factory.newTransaction(namespace, 'Offer');
    offer.bidPrice = 100;
    offer.member = factory.newRelationship(namespace, 'Member', 'sstone1@example.com');
    offer.listing = factory.newRelationship(namespace, 'ProductListing', assetId);
    await businessNetworkConnection.submitTransaction(offer);
    await useIdentity(matthewCardName);
    offer = factory.newTransaction(namespace, 'Offer');
    offer.bidPrice = 1000;
    offer.member = factory.newRelationship(namespace, 'Member', 'whitemat@example.com');
    offer.listing = factory.newRelationship(namespace, 'ProductListing', assetId);
    await businessNetworkConnection.submitTransaction(offer);
    var productListing = await productListingRegistry.get(assetId);
    productListing.offers.length.should.equal(2);
  });
  it('Close bid for the product', async () => {
    await useIdentity(danielCardName);
    const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    const sellerId = 'daniel.selman@example.com';
    const sellerNS = namespace + '.Seller';
    const sellerRegistry = await businessNetworkConnection.getParticipantRegistry(sellerNS);
    const seller = await sellerRegistry.get('daniel.selman@example.com');
    var productid = seller.products[0].getIdentifier();
    const listing = factory.newTransaction(namespace, 'StartBidding');
    listing.listingId = 'l1';
    listing.reservePrice = 50;
    listing.product = factory.newRelationship(namespace, 'Product', productid);
    await businessNetworkConnection.submitTransaction(listing);
    const productListingRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.ProductListing');
    const assets = await productListingRegistry.getAll();
    assets.should.have.lengthOf(1);
    var assetId = assets[0].getIdentifier();
    var productId = assets[0].product.getIdentifier();
    var buyerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Member');
    await useIdentity(simonCardName);
    var offer = factory.newTransaction(namespace, 'Offer');
    offer.bidPrice = 100;
    offer.member = factory.newRelationship(namespace, 'Member', 'sstone1@example.com');
    offer.listing = factory.newRelationship(namespace, 'ProductListing', assetId);
    await businessNetworkConnection.submitTransaction(offer);
    await useIdentity(matthewCardName);
    offer = factory.newTransaction(namespace, 'Offer');
    offer.bidPrice = 1000;
    offer.member = factory.newRelationship(namespace, 'Member', 'whitemat@example.com');
    offer.listing = factory.newRelationship(namespace, 'ProductListing', assetId);
    await businessNetworkConnection.submitTransaction(offer);
    var productListing = await productListingRegistry.get(assetId);
    productListing.offers.length.should.equal(2);
    await useIdentity(danielCardName);
    offer = factory.newTransaction(namespace, 'CloseBidding');
    offer.listing = factory.newRelationship(namespace, 'ProductListing', assetId);
    await businessNetworkConnection.submitTransaction(offer);
    const productRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Product');
    const product = await productRegistry.get(productid);
    product.owner.$identifier.should.equal('whitemat@example.com');
  });
});