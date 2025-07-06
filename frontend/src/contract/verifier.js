import { ethers } from 'ethers'
import verifierAbi from './VerifierABI.json' // 👈 ABI generated from your verifier contract
const verifierAddress = '0xYourVerifierContractAddress' // 🎯 Update this!

export async function verifyZKOnChain(proof, publicSignals) {
  if (!window.ethereum) throw new Error("MetaMask not found")

  await window.ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const contract = new ethers.Contract(verifierAddress, verifierAbi, signer)

  // Format proof for Solidity
  const { pi_a, pi_b, pi_c } = proof
  const input = publicSignals.map(BigInt)

  const isValid = await contract.verifyProof(
    [pi_a[0], pi_a[1]],
    [
      [pi_b[0][1], pi_b[0][0]],
      [pi_b[1][1], pi_b[1][0]],
    ],
    [pi_c[0], pi_c[1]],
    input
  )

  return isValid
}
