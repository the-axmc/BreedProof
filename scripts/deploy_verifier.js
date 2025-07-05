const hre = require("hardhat");

async function main() {
  const Verifier = await hre.ethers.getContractFactory("Groth16Verifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment(); // ✅ New ethers v6 method
  console.log("Verifier deployed to:", await verifier.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment error:", error);
  process.exitCode = 1;
});
