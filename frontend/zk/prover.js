// frontend/src/zk/prover.js
import { groth16 } from 'snarkjs'

export async function generateProof(input) {
  const wasmPath = '/zk/verify_breed.wasm'
  const zkeyPath = '/zk/verify_breed.zkey'

  try {
    const { proof, publicSignals } = await groth16.fullProve(
      input,
      wasmPath,
      zkeyPath
    )

    console.log('✅ Proof generated:', proof)
    console.log('🔓 Public signals:', publicSignals)

    return { proof, publicSignals }
  } catch (err) {
    console.error('❌ ZK proof generation failed:', err)
    throw err
  }
}
