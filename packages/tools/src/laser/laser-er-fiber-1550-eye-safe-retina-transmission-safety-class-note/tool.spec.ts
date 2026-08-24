import { describe, expect, it } from "vitest";
import {
  erEyeSafeClassificationExample as example,
  runErEyeSafeClassification,
} from "./tool.js";
describe("ocular spectral-region lookup", () => {
  it("classifies 1550 nm outside the retinal hazard region", () =>
    expect(runErEyeSafeClassification(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("assigns the 1400 nm boundary to IR-B", () =>
    expect(runErEyeSafeClassification({ wavelengthNm: 1400 })).toMatchObject({
      ok: true,
      output: { reachesRetina: false },
    }));
  it("rejects wavelengths outside the table", () =>
    expect(runErEyeSafeClassification({ wavelengthNm: 100 }).ok).toBe(false));
});
