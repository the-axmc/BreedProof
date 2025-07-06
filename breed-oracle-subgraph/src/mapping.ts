import {
  AnimalRegistered,
  ScoreAssigned,
  AnimalVerified,
} from "../generated/BreedOracleConsumer/BreedOracleConsumer";
import { Animal } from "../generated/schema";
import { log } from "@graphprotocol/graph-ts";

export function handleAnimalRegistered(event: AnimalRegistered): void {
  let id = event.params.animalId.toHexString();
  let entity = new Animal(id);
  entity.animalId = id;
  entity.name = event.params.name;
  entity.species = event.params.species;
  entity.owner = event.params.owner;
  entity.save();
}

export function handleScoreAssigned(event: ScoreAssigned): void {
  let id = event.params.animalId.toHexString();
  let entity = Animal.load(id);
  if (entity) {
    entity.score = event.params.score;
    entity.save();
  }
}

export function handleAnimalVerified(event: AnimalVerified): void {
  let id = event.params.animalId.toHexString();
  let entity = Animal.load(id);
  if (entity) {
    entity.verified = event.params.verified;
    entity.save();
  }
}
