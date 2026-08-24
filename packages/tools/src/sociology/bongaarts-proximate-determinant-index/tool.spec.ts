import { describe, expect, it } from "vitest";
import {
  bongaartsProximateDeterminantIndexExample,
  bongaartsProximateDeterminantIndexTool,
  calculateBongaartsProximateIndex,
  runBongaartsProximateDeterminantIndex,
} from "./tool.js";

describe("bongaartsProximateDeterminantIndexTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runBongaartsProximateDeterminantIndex(
        bongaartsProximateDeterminantIndexExample.input,
      ),
    ).toEqual({
      ok: true,
      output: bongaartsProximateDeterminantIndexExample.output,
    });
  });

  it("multiplies all four determinant indices and rejects out-of-range inputs", () => {
    expect(
      calculateBongaartsProximateIndex({
        contraceptionIndex: 0.5,
        inducedAbortionIndex: 0.8,
        marriageIndex: 0.75,
        postpartumInfecundabilityIndex: 0.4,
      }).proximateDeterminantsIndex,
    ).toBeCloseTo(0.12, 15);
    const result = runBongaartsProximateDeterminantIndex({
      ...bongaartsProximateDeterminantIndexExample.input,
      marriageIndex: 1.1,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("marriageIndex");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(bongaartsProximateDeterminantIndexExample)),
    ).toEqual(bongaartsProximateDeterminantIndexExample);
    expect(bongaartsProximateDeterminantIndexTool.contractVersion).toBe(1);
    expect(bongaartsProximateDeterminantIndexTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runBongaartsProximateDeterminantIndex(null).ok).toBe(false);
    expect(
      runBongaartsProximateDeterminantIndex({
        ...bongaartsProximateDeterminantIndexExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
