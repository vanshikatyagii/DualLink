const hre = require("hardhat");

async function main() {
  const AccessControl = await hre.ethers.getContractFactory("AccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.deployed();
  console.log("AccessControl deployed at:", accessControl.address);

  const ImageRegistry = await hre.ethers.getContractFactory("ImageRegistry");
  const registry = await ImageRegistry.deploy(accessControl.address);
  await registry.deployed();
  console.log("ImageRegistry deployed at:", registry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//
