import { describe, expect, it } from "vitest";
import {
  runWaterAbsorptionDepth,
  waterAbsorptionDepthExample as example,
} from "./tool.js";
describe("water absorption and penetration depth", () => {
  it("uses an exact tabulated wavelength without interpolation", () =>
    expect(runWaterAbsorptionDepth(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("interpolates between table rows", () =>
    expect(runWaterAbsorptionDepth({ wavelengthNm: 1940 })).toMatchObject({
      ok: true,
      output: { interpolated: true },
    }));
  it("rejects extrapolation beyond the table", () =>
    expect(runWaterAbsorptionDepth({ wavelengthNm: 500 }).ok).toBe(false));
});
