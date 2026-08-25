import { describe, expect, it } from "vitest";
import {
  freightClassNmfcDensityLookupExample,
  runFreightClassNmfcDensityLookup,
} from "./tool.js";

describe("freight-class-nmfc-density-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFreightClassNmfcDensityLookup(
        freightClassNmfcDensityLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: freightClassNmfcDensityLookupExample.output,
    });
  });

  it("assigns the top class for very dense freight", () => {
    const result = runFreightClassNmfcDensityLookup({
      weightLb: 1200,
      lengthIn: 24,
      widthIn: 24,
      heightIn: 24,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.densityPcf as number).toBe(150);
    expect(result.output.nmfcClass).toBe("50");
  });
  it("rejects non-positive weight", () => {
    expect(
      runFreightClassNmfcDensityLookup({
        weightLb: 0,
        lengthIn: 48,
        widthIn: 40,
        heightIn: 36,
      }).ok,
    ).toBe(false);
  });
});
