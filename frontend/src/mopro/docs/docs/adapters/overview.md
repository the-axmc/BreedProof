# Adapters

The objective of Mopro is to support a wide range of circuits and platforms. To achieve this, Mopro provides adapters that allow you to build proofs for your circuits and do other cryptographic operations on different platforms. The adapters are designed to be modular and easy to use.

## Overview

Mopro's modular architecture allows you to combine different adapters in your project, such as mixing Halo2 and Circom circuits in the same project. The adapters are designed to be easy to use and to provide a consistent interface across different platforms.

## Enabling Adapters

To activate a specific adapter, you must enable it in your Rust project's `Cargo.toml` file using the `mopro-ffi` feature mechanism. Each adapter has its own feature name, along with a list of dependencies that need to be included in your project.

For example, to enable the Circom adapter, ensure that the `mopro-ffi/circom` feature is enabled in your `Cargo.toml` file:

```toml
[features]
default = ["mopro-ffi/circom"]
```

To mix different adapters, you can enable multiple features:

```toml
[features]
default = ["mopro-ffi/circom", "mopro-ffi/halo2"]
```

For adapter specific dependencies, please refer to each adapter's documentation.

## Supported Adapters

-   [Circom](/adapters/circom.md) - `["mopro-ffi/circom"]`
-   [Halo2](/adapters/halo2.md) - `["mopro-ffi/halo2"]`
-   [Noir](/adapters/noir.md) - `["mopro-ffi/noir"]`

## Using Adapters

Each adapter provides its functionality to set it up for the project as well as exports its own functions to be used on the target platform. Detailed information can be found on each adapter’s documentation page.

## Using Multiple Adapters

The adapters are independent of each other, so they can be used simultaneously in the same project. For example, you can use both Circom and Halo adapters in the same project:

```rust
mopro_ffi::app!();

// Circom adapter
rust_witness::witness!(multiplier2);

mopro_ffi::set_circom_circuits! {
    ("multiplier2_final.zkey", mopro_ffi::witness::WitnessFn::RustWitness(multiplier2_witness)),
}

// Halo2 adapter
mopro_ffi::set_halo2_circuits! {
    ("plonk_fibonacci_pk.bin", plonk_fibonacci::prove, "plonk_fibonacci_vk.bin", plonk_fibonacci::verify),
}
```

In the iOS project, you can utilize both adapters:

```swift
let circomProofResult = try generateCircomProof(zkeyPath: zkeyPath, circuitInputs: inputs, proofLib: ProofLib.arkworks)

let halo2ProofResult = try generateHalo2Proof(srsPath: srsPath, pkPath: pkPath, circuitInputs: inputs)
```

## Custom Adapters

Even if you're using an adapter that isn’t officially supported by Mopro, you can still integrate it using [UniFFI](https://github.com/mozilla/uniffi-rs). This allows you to build custom adapters, for example

-   Binius: https://github.com/vivianjeng/binius-sha256
-   Spartan: https://github.com/zkmopro/mopro/pull/244
-   Nova Scotia: https://github.com/zkmopro/mopro/pull/240

🔧 For setup details, refer to the [Rust Setup](/docs/setup/rust-setup) guide.
