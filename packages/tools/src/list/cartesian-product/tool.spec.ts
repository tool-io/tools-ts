import { describe, expect, it } from "vitest";
import {
  cartesianProductExample,
  calculateCartesianProduct,
  runCartesianProduct,
} from "./tool.js";

describe("list/cartesian-product", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCartesianProduct(cartesianProductExample.input)).toEqual({
      ok: true,
      output: cartesianProductExample.output,
    });
  });
  it("rejects invalid input (empty_list)", () => {
    expect(runCartesianProduct({ first: [], second: [1] }).ok).toBe(false);
  });
  it("rejects invalid input (empty_list)", () => {
    expect(runCartesianProduct({ first: [1], second: [] }).ok).toBe(false);
  });
  it("produces first.length times second.length pairs", () => {
    const result = runCartesianProduct({ first: [1, 2], second: [10, 20, 30] });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.pairs).toHaveLength(6);
  });
});
