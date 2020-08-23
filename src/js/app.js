App = {
  web3Provider: null,
  //Initialiizng all the contracts
  contracts: {},
  account: "0x0",
  loading: false,
  tokenPrice: 0,
  tokenSold: 0,
  tokensAvailable: 75000000,
  init: async function () {
    await console.log("App initialized");
    return App.initWeb3();
  },
  initWeb3: function () {
    window.ethereum.enable();
    if (typeof web3 !== "undefined") {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:8545"
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },
  //initContract is going to get all smart contract abis.
  initContracts: async function () {
    $.getJSON("DappTokenSale.json", function (dappTokenSale) {
      App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
      App.contracts.DappTokenSale.setProvider(App.web3Provider);
      App.contracts.DappTokenSale.deployed()
        .then(function (dappTokenSale) {
          console.log("Initailaixed contract address:", dappTokenSale.address);
        })
        .then(function () {
          $.getJSON("DappToken.json", function (dappToken) {
            App.contracts.DappToken = TruffleContract(dappToken);
            console.log(App.contracts.DappToken);
            App.contracts.DappToken.setProvider(App.web3Provider);
            console.log(App.contracts.DappToken);
            App.contracts.DappToken.deployed().then(function (dappToken) {
              console.log("DappToken addresss:", dappToken.address);
            });
            return App.render();
          });
        });
    });
  },
  //All the function rendering done here.
  render: async function () {
    //Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err == null) {
        App.account = account;
        $("#accountaddress").html("Your account:" + account);
      }
    });
    //Rendering the dappTokenSale contract
    App.contracts.DappTokenSale.deployed()
      .then(function (instance) {
        dappTokenSaleInstance = instance;
        return dappTokenSaleInstance.tokenPrice();
      })
      .then(function (tokenPrice) {
        App.tokenPrice = tokenPrice;
        console.log(App.tokenPrice.toNumber());
        $("#token-price").html(
          web3.fromWei(App.tokenPrice, "ether").toNumber()
        );
        return dappTokenSaleInstance.tokenSold();
      })
      .then(function (tokenSold) {
        App.tokenSold = tokenSold.toNumber();

        $(".tokens-sold").html(App.tokenSold);
        $(".tokens-available").html(App.tokensAvailable);
        var progressPercent = (App.tokenSold / App.tokensAvailable) * 100;
        console.log(progressPercent);
        $("#progress").css("width", progressPercent + "%");
      });
    //Rendering the dappToken contract
    App.contracts.DappToken.deployed()
      .then(function (instance) {
        dappTokenInstance = instance;
        return dappTokenInstance.balanceOf(App.account);
      })
      .then(function (balance) {
        $(".dapp-balance").html(balance.toNumber());
      });
  },
  buyTokens: function () {
    var numberOfTokens = $("#numberOfToken").val();
    App.contracts.DappTokenSale.deployed().then(function (instance) {
      return instance
        .buyTokens(numberOfTokens, {
          from: App.account,
          value: App.tokenPrice * numberOfTokens,
          gas: 50000,
        })
        .then(function (result) {
          console.log("Tokens bought");
          //reseting the number of tokens in the contract
          $("form").trigger("reset");
        });
    });
  },
};

//Initializing the app
$(function () {
  $(window).load(function () {
    App.init();
  });
});
