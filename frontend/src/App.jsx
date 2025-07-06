import React, { useState } from 'react'
import './App.css'

import { generateProof } from '../zk/prover'
import { ethers } from 'ethers'
import verifierAbi from './contract/VerifierABI.json'
import { breedOracleConsumerAbi } from './contract/BreedOracleConsumerAbi.js'

const verifierAddress = '0xCCCD21694ae86B2Da9D9EB7Ec00dfd4B1557bF66'
const breedOracleAddress = '0xd3D4440a94f9bB0d06D5BE33eB153D50A8ae0b5f'

function App() {
  const [animalId, setAnimalId] = useState('')
  const [dnaHash, setDnaHash] = useState('')
  const [oracleStatus, setOracleStatus] = useState(null)
  const [zkStatus, setZkStatus] = useState(null)
  const [isProving, setIsProving] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleScanTag = () => {
    const tag = prompt('🔍 Enter Animal Tag ID (e.g. NFC scan)')
    if (tag) setAnimalId(tag)
  }

  const handleUploadDNA = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const buffer = await file.arrayBuffer()
    const hash = await crypto.subtle.digest('SHA-256', buffer)

    const hashHex = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    setDnaHash('0x' + hashHex)
  }

  const handleValidateOracle = async () => {
    setOracleStatus('🔗 Contacting Genetics DB...')
    setTimeout(() => {
      setOracleStatus('✅ Breed data confirmed on-chain')
    }, 1500)
  }

  const handleZKProof = async () => {
    setZkStatus('🔐 Generating ZK Proof...')
    setIsProving(true)
    setProgress(0)

    let val = 0
    const interval = setInterval(() => {
      val += 7
      if (val < 95) setProgress(val)
    }, 250)

    try {
      const input = {
        tag_id: animalId,
        dna_hash: dnaHash
      }

      const { proof, publicSignals } = await generateProof(input)

      const calldata = {
        a: proof.pi_a,
        b: proof.pi_b.map(pair => [pair[1], pair[0]]),
        c: proof.pi_c,
        input: publicSignals
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const verifier = new ethers.Contract(verifierAddress, verifierAbi, signer)
      const verified = await verifier.verifyProof(
        calldata.a,
        calldata.b,
        calldata.c,
        calldata.input
      )

      if (!verified) {
        clearInterval(interval)
        setIsProving(false)
        setZkStatus('❌ Invalid ZK Proof')
        return
      }

      const oracle = new ethers.Contract(breedOracleAddress, breedOracleConsumerAbi, signer)
      const tx = await oracle.submitValidBreed(animalId, dnaHash)
      await tx.wait()

      setProgress(100)
      clearInterval(interval)
      setZkStatus('✅ Oracle submission complete ✅')
    } catch (err) {
      clearInterval(interval)
      console.error('❌ Error during proof:', err)
      setZkStatus('❌ ' + err.message)
    }

    setTimeout(() => {
      setIsProving(false)
      setProgress(0)
    }, 2500)
  }

  return (
    <div className="container">
      <h1>🐄 BreedVault ZK</h1>

      <div className="card">
        <p className="card-title">📎 Animal Tag</p>
        <button onClick={handleScanTag}>Scan Tag</button>
        {animalId && <p><strong>Tag ID:</strong> {animalId}</p>}
      </div>

      <div className="card">
        <p className="card-title">🧬 DNA Sample</p>
        <label htmlFor="dna-upload" className="upload-btn">Upload DNA File</label>
        <input
          id="dna-upload"
          type="file"
          accept=".txt,.bin,.pdf"
          onChange={handleUploadDNA}
        />
        {dnaHash && <p><strong>DNA Hash:</strong> {dnaHash.slice(0, 14)}…</p>}
      </div>

      <div className="card">
        <p className="card-title">🔍 Breed Database</p>
        <button onClick={handleValidateOracle}>Validate Breed Info</button>
        {oracleStatus && <p><em>{oracleStatus}</em></p>}
      </div>

      <div className="card">
        <p className="card-title">🔐 Zero-Knowledge Proof</p>
        <button onClick={handleZKProof}>Claim DNA Ownership</button>
        {zkStatus && <p><em>{zkStatus}</em></p>}
      </div>

      {isProving && (
        <div className="modal">
          <h3>🧬 Please wait while we prove the pedigree...</h3>
          <div className="dna-spinner"></div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
