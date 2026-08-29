import { describe, expect, it } from "vitest";
import {
  runSpectroscopyPathLength,
  spectroscopyPathLengthExample,
} from "./tool.js";
describe("Path Length From Beer Law", () => {
  it("publishes an executable example", () =>
    expect(
      runSpectroscopyPathLength(spectroscopyPathLengthExample.input),
    ).toEqual({
      ok: true,
      output: spectroscopyPathLengthExample.output,
    }));
  it("returns one centimeter for unit ratio inputs", () =>
    expect(
      runSpectroscopyPathLength({
        absorbance: 2,
        epsilon: 20000,
        concentrationM: 1e-4,
      }),
    ).toEqual({ ok: true, output: { pathLengthCm: 1 } }));
  it("doubles path length when absorbance doubles", () =>
    expect(
      runSpectroscopyPathLength({
        absorbance: 0.6,
        epsilon: 20000,
        concentrationM: 1e-4,
      }),
    ).toEqual({ ok: true, output: { pathLengthCm: 0.3 } }));
  it("halves path length when concentration doubles", () => {
    const result = runSpectroscopyPathLength({
      absorbance: 1,
      epsilon: 20000,
      concentrationM: 2e-4,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.pathLengthCm).toBeCloseTo(0.25, 12);
  });
  it("matches a ten centimeter cell case closely", () => {
    const result = runSpectroscopyPathLength({
      absorbance: 0.5,
      epsilon: 5000,
      concentrationM: 1e-5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.pathLengthCm).toBeCloseTo(10, 9);
  });
  it("rejects zero absorbance", () =>
    expect(
      runSpectroscopyPathLength({
        absorbance: 0,
        epsilon: 20000,
        concentrationM: 1e-4,
      }).ok,
    ).toBe(false));
  it("rejects zero epsilon", () =>
    expect(
      runSpectroscopyPathLength({
        absorbance: 1,
        epsilon: 0,
        concentrationM: 1e-4,
      }).ok,
    ).toBe(false));
  it("rejects zero concentration", () =>
    expect(
      runSpectroscopyPathLength({
        absorbance: 1,
        epsilon: 20000,
        concentrationM: 0,
      }).ok,
    ).toBe(false));
});
