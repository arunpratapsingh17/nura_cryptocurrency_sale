const _deploy_contracts = require("../migrations/2_deploy_contracts");

var DappToken = artifacts.require("./DappToken.sol");

contract("DappToken", async (accounts) => {
  it("Initializes the variables correctly", async () => {
    var tokenInstance = await DappToken.deployed();
    const name = await tokenInstance.name();
    assert.equal(name, "Dapp Token");
    const symbol = await tokenInstance.symbol();
    assert.equal(symbol, "DAPP");
    const version = await tokenInstance.standard();
    assert.equal(version, "Dapp Token version 1.0");
  });

  it("Sets the total supply", async () => {
    var tokenInstance = await DappToken.deployed();
    const ttotalSupply = await tokenInstance.totalSupply();
    assert.equal(ttotalSupply.toNumber(), 1000000);
  });
  it("Approves the delegated transfer", async () => {
    const app = await DappToken.deployed();
    const final = await app.approve.call(accounts[1], 100);
    assert.equal(final, true);
  });
  // it("Handle the transfer of the delegated amount", function () {
  //   return DappToken.deployed()
  //     .then(function (instance) {
  //       tokenInstance = instance;
  //       fromAccount = accounts[2];
  //       toAccount = accounts[3];
  //       spendingAccount = accounts[4];
  //       return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
  //     })
  //     .then(function (reciept) {
  //       return tokenInstance.approve(spendingAccount, 10);
  //     });
  // });
});
