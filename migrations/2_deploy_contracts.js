//Artifacts makes an abstraction(interface) of DappToken which we can use in javascript environment.
const DappToken = artifacts.require("DappToken");
const DappTokenSale = artifacts.require("DappTokenSale");
module.exports = function (deployer) {
  deployer.deploy(DappToken, 1000000).then(async function () {
    await deployer.deploy(DappTokenSale, DappToken.address, 1000000);
  });
};
