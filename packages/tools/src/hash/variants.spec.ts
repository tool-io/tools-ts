import { describe, expect, it } from "vitest";
import { loadToolModule } from "../registry.js";

const variants = [
  "blake-224",
  "blake-256",
  "blake-384",
  "blake-512",
  "blake2b-512",
  "blake2s-256",
  "blake3",
  "keccak-224",
  "keccak-256",
  "keccak-384",
  "keccak-512",
  "md5",
  "ripemd-160",
  "sha-1",
  "sha-224",
  "sha-256",
  "sha-384",
  "sha-512",
  "sha-512-224",
  "sha-512-256",
  "sha3-224",
  "sha3-256",
  "sha3-384",
  "sha3-512",
  "shake-128",
  "shake-256",
];

describe("hash variants", () => {
  it("publishes executable canonical examples for every listed hash", async () => {
    for (const variant of variants) {
      const module = await loadToolModule(`hash/${variant}`);
      expect(module, variant).toBeDefined();
      const result = module!.default.execute(module!.example!.input);
      expect(result, variant).toEqual({
        ok: true,
        output: module!.example!.output,
      });
    }
  });
});
