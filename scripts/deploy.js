async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const ContractFactory = await ethers.getContractFactory("BreedProofNFT");
  const contract = await ContractFactory.deploy();

  await contract.waitForDeployment(); // ✅ works in newer Hardhat releases

  const address = await contract.getAddress();

  console.log("✅ Contract deployed at:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
