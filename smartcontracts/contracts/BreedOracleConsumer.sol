// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BreedOracleConsumer {
    struct Animal {
        string animalId;
        bytes32 dnaHash;
        string breed;
        string species;
        uint256 score;
        bool verified;
        address owner;
    }

    mapping(string => Animal) public animals;

    event AnimalRegistered(
        string indexed animalId,
        bytes32 indexed dnaHash,
        string breed,
        string species,
        address indexed owner
    );

    event ScoreAssigned(
        string indexed animalId,
        uint256 score
    );

    event AnimalVerified(
        string indexed animalId,
        bool verified
    );

    /// @notice Register the animal once its NFC and ZK Proof are validated client-side
    function registerAnimal(
        string memory animalId,
        bytes32 dnaHash,
        string memory breed,
        string memory species
    ) public {
        require(animals[animalId].owner == address(0), "Already registered");

        animals[animalId] = Animal({
            animalId: animalId,
            dnaHash: dnaHash,
            breed: breed,
            species: species,
            score: 0,
            verified: false,
            owner: msg.sender
        });

        emit AnimalRegistered(animalId, dnaHash, breed, species, msg.sender);
    }

    /// @notice Oracle or ZK-verifier assigns score
    function assignScore(string memory animalId, uint256 score) public {
        require(animals[animalId].owner != address(0), "Animal not found");

        animals[animalId].score = score;
        animals[animalId].verified = true;

        emit ScoreAssigned(animalId, score);
        emit AnimalVerified(animalId, true);
    }

    /// @notice View function for The Graph to index
    function getAnimal(string memory animalId) public view returns (
        string memory,
        bytes32,
        string memory,
        string memory,
        uint256,
        bool,
        address
    ) {
        Animal memory a = animals[animalId];
        return (
            a.animalId,
            a.dnaHash,
            a.breed,
            a.species,
            a.score,
            a.verified,
            a.owner
        );
    }
}
