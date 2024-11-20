require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [process.env.SEPOLIA_PRIVATE_KEY]
    }
  }
};
