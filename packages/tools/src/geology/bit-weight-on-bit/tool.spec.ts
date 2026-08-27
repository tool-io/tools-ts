import { describe, expect, it } from "vitest";
import { bitWeightOnBitExample, runBitWeightOnBit } from "./tool.js";

describe("bit-weight-on-bit", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBitWeightOnBit(bitWeightOnBitExample.input)).toEqual({
      ok: true,
      output: bitWeightOnBitExample.output,
    });
  });

  it("returns zero-free positive differentials for light strings", () => {
    const result = runBitWeightOnBit({
      stringWeightOffBottomKilonewtons: 500,
      stringWeightOnBottomKilonewtons: 450,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.weightOnBitKilonewtons).toBe(50);
  });

  it("rejects hook loads that increase on bottom", () => {
    expect(
      runBitWeightOnBit({
        stringWeightOffBottomKilonewtons: 500,
        stringWeightOnBottomKilonewtons: 600,
      }).ok,
    ).toBe(false);
  });
});
