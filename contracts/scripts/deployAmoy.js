
const hre = require("hardhat");

async function main() {
  console.log("Deploying Anchor.sol to Amoy...");
  const Anchor = await hre.ethers.getContractFactory("Anchor");
  const anchor = await Anchor.deploy();
  await anchor.deployed();

  console.log("Anchor deployed successfully!");
  console.log("Contract address:", anchor.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
