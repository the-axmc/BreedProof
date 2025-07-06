// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BreedProofRegistry {
    struct Animal {
        string animalId;
        bytes32 dnaHash;
        uint256 score;
        bool verified;
        address owner;
    }

    mapping(string => Animal) public animals;

    event AnimalRegistered(string indexed animalId, bytes32 dnaHash, address indexed owner);
    event ScoreUpdated(string indexed animalId, uint256 score);

    function registerAnimal(string memory animalId, bytes32 dnaHash) public {
        require(animals[animalId].owner == address(0), "Animal already registered");

        animals[animalId] = Animal({
            animalId: animalId,
            dnaHash: dnaHash,
            score: 0,
            verified: false,
            owner: msg.sender
        });

        emit AnimalRegistered(animalId, dnaHash, msg.sender);
    }

    function updateScore(string memory animalId, uint256 newScore) public {
        require(animals[animalId].owner != address(0), "Animal not found");

        animals[animalId].score = newScore;
        animals[animalId].verified = true;

        emit ScoreUpdated(animalId, newScore);
    }

    function getAnimal(string memory animalId) public view returns (Animal memory) {
        return animals[animalId];
    }
}
