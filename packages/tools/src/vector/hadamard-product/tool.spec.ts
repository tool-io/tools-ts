import { describe, expect, it } from "vitest";
import {
  hadamardProductExample,
  calculateHadamardProduct,
  runHadamardProduct,
} from "./tool.js";

describe("vector/hadamard-product", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHadamardProduct(hadamardProductExample.input)).toEqual({
      ok: true,
      output: hadamardProductExample.output,
    });
  });
  it("rejects invalid input (length_mismatch)", () => {
    expect(runHadamardProduct({ a: [1, 2], b: [1] }).ok).toBe(false);
  });
});
