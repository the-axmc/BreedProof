pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template VerifyBreed() {
    signal input dna_hash;
    signal input expected_hash;
    signal output is_valid;

    component isEq = IsEqual();
    isEq.in[0] <== dna_hash;
    isEq.in[1] <== expected_hash;
    is_valid <== isEq.out;
}

component main = VerifyBreed();
