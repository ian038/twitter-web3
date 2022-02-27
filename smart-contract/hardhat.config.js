require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/SXEAz39ENCPij0XPjUhp9Vl4e4YmkAwk',
      accounts: ['f2679263aadf9db7949246a5265f7cf0b0aece610ba4d84dcfc9304ccd050d0c']
    }
  }
};
