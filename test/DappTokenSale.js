const _deploy_contracts = require("../migrations/2_deploy_contracts");
const DappToken = artifacts.require("./DappToken.sol");
const DappTokenSale = artifacts.require("./DappTokenSale.sol");
contract("DappTokenSale", function (accounts) {
  var tokenSaleInstance;
  var buyer = accounts[1];
  var tokenPrice = 1000000;
  var numberOfTokens;
  it("Initializes the contract", function () {
    return DappTokenSale.deployed()
      .then(function (instance) {
        tokenSaleInstance = instance;
        return tokenSaleInstance.address;
      })
      .then(function (address) {
        assert.notEqual(address, 0x0, "Has contract address");
        return tokenSaleInstance.tokenContract();
      })
      .then(function (address) {
        assert.notEqual(address, 0x0, "Has contract address");
        return tokenSaleInstance.tokenPrice();
      })
      .then(function (price) {
        assert.equal(price, tokenPrice, "Token price is correct");
      });
  });
  it("Ensures token buying", function () {
    return DappTokenSale.deployed().then(function (instance) {
      tokenSaleInstance = instance;
      numberOfTokens = 10;
      var value = numberOfTokens * tokenPrice;
      return tokenSaleInstance
        .buyTokens(numberOfTokens, {
          from: buyer,
          value: value,
        })
        .then(function (receipt) {
          return tokenSaleInstance.tokenSold();
        })
        .then(function (amount) {
          assert.equal(
            amount.toNumber(),
            numberOfTokens,
            "Increments the number of sold tokens"
          );
          return tokenSaleInstance.buyTokens(numberOfTokens, {
            from: buyer,
            value: numberOfTokens * tokenPrice,
          });
        });
    });
  });
  it("End token sale", function () {
    return DappToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return DappTokenSale.deployed();
      })
      .then(function (instance) {
        tokenSaleInstance = instance;
        return tokenSaleInstance.endSale({ from: accounts[0] });
      });
  });
});
