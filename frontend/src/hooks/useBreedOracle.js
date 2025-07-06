import { ethers } from "ethers";
import oracleAbi from "../abi/BreedOracleABI.json";

const oracleAddress = "0xYourConsumerContract";

export async function requestBreedScore(animalId, signer) {
  const contract = new ethers.Contract(oracleAddress, oracleAbi, signer);
  const tx = await contract.requestBreedValue(animalId);
  await tx.wait();
}
