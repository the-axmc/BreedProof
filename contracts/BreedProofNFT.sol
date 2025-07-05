// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BreedProofNFT is ERC721 {
    uint256 public tokenCounter;
    mapping(uint256 => string) public dnaHashes;

    constructor() ERC721("BreedProof", "BRDP") {}

    function mintBreedNFT(string memory dnaHash) public {
        _safeMint(msg.sender, tokenCounter);
        dnaHashes[tokenCounter] = dnaHash;
        tokenCounter++;
    }

    function getDNA(uint256 tokenId) public view returns (string memory) {
        return dnaHashes[tokenId];
    }
}
