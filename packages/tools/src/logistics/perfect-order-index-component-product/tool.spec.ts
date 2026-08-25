import { describe, expect, it } from "vitest";
import {
  perfectOrderIndexComponentProductExample,
  runPerfectOrderIndexComponentProduct,
} from "./tool.js";

describe("logistics/perfect-order-index-component-product", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPerfectOrderIndexComponentProduct(
        perfectOrderIndexComponentProductExample.input,
      ),
    ).toEqual({
      ok: true,
      output: perfectOrderIndexComponentProductExample.output,
    });
  });

  it("defaults every component to one hundred percent", () => {
    const result = runPerfectOrderIndexComponentProduct({});
    if (!result.ok) throw new Error("expected success");
    expect(result.output.perfectOrderIndexPercent as number).toBe(100);
  });

  it("rejects components above 100 percent via schema validation", () => {
    expect(
      runPerfectOrderIndexComponentProduct({ onTimePercent: 100.5 }).ok,
    ).toBe(false);
  });
});
