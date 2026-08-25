import { describe, expect, it } from "vitest";
import {
  nmfcDensityToClassConverterExample,
  runNmfcDensityToClassConverter,
} from "./tool.js";

describe("nmfc-density-to-class-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNmfcDensityToClassConverter(nmfcDensityToClassConverterExample.input),
    ).toEqual({
      ok: true,
      output: nmfcDensityToClassConverterExample.output,
    });
  });

  it("places a boundary density in the lower-numbered band", () => {
    const result = runNmfcDensityToClassConverter({ densityPcf: 50 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.nmfcClass).toBe("50");
  });
  it("rejects non-positive density", () => {
    expect(runNmfcDensityToClassConverter({ densityPcf: 0 }).ok).toBe(false);
  });
});
