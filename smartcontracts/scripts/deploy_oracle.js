const hre = require("hardhat");

async function main() {
  const verifierAddress = "0xCCCD21694ae86B2Da9D9EB7Ec00dfd4B1557bF66";

  const BreedOracleConsumer = await hre.ethers.getContractFactory("BreedOracleConsumer");
  const contract = await BreedOracleConsumer.deploy([verifierAddress]); // <-- array!

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ BreedOracleConsumer deployed to:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
