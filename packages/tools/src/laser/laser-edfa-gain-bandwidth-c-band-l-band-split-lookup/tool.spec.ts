import { describe, expect, it } from "vitest";
import { edfaBandLookupExample as example, runEdfaBandLookup } from "./tool.js";
describe("EDFA band lookup", () => {
  it("classifies the canonical C-band wavelength", () =>
    expect(runEdfaBandLookup(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("uses half-open boundaries", () =>
    expect(runEdfaBandLookup({ wavelengthNm: 1565 })).toMatchObject({
      ok: true,
      output: { bandName: "L-band", positionWithinBandPercent: 0 },
    }));
});
