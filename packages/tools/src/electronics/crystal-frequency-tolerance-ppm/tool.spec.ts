import { describe, expect, it } from "vitest";
import {
  calculateCrystalFrequencyTolerancePpm,
  crystalFrequencyTolerancePpmExample,
  runCrystalFrequencyTolerancePpm,
} from "./tool.js";

describe("Crystal Tolerance Window", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCrystalFrequencyTolerancePpm(
        crystalFrequencyTolerancePpmExample.input,
      ),
    ).toEqual({
      ok: true,
      output: crystalFrequencyTolerancePpmExample.output,
    });
  });

  it("matches a common 20 ppm watch crystal", () => {
    expect(
      runCrystalFrequencyTolerancePpm({
        nominalHz: 16000000,
        tolerancePpm: 20,
      }),
    ).toEqual({ ok: true, output: { toleranceWindowHz: 320 } });
  });

  it("reports a zero window for a perfect part", () => {
    expect(
      runCrystalFrequencyTolerancePpm({
        nominalHz: 8000000,
        tolerancePpm: 0,
      }),
    ).toEqual({ ok: true, output: { toleranceWindowHz: 0 } });
  });

  it("scales linearly with tolerance", () => {
    const loose = calculateCrystalFrequencyTolerancePpm({
      nominalHz: 26000000,
      tolerancePpm: 30,
    }).toleranceWindowHz;
    const tighter = calculateCrystalFrequencyTolerancePpm({
      nominalHz: 26000000,
      tolerancePpm: 10,
    }).toleranceWindowHz;
    expect(loose).toBe(tighter * 3);
  });

  it("scales linearly with nominal frequency", () => {
    const base = calculateCrystalFrequencyTolerancePpm({
      nominalHz: 1000000,
      tolerancePpm: 25,
    }).toleranceWindowHz;
    const higher = calculateCrystalFrequencyTolerancePpm({
      nominalHz: 4000000,
      tolerancePpm: 25,
    }).toleranceWindowHz;
    expect(higher).toBe(base * 4);
  });

  it("rejects zero nominal frequency via invalid_frequency", () => {
    expect(
      runCrystalFrequencyTolerancePpm({ nominalHz: 0, tolerancePpm: 50 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_frequency", field: "nominalHz" }] },
      ok: false,
    });
  });

  it("rejects negative tolerance via invalid_tolerance", () => {
    expect(
      runCrystalFrequencyTolerancePpm({
        nominalHz: 10000000,
        tolerancePpm: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_tolerance", field: "tolerancePpm" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runCrystalFrequencyTolerancePpm({ tolerancePpm: 50 })).toMatchObject(
      {
        error: { issues: [{ code: "invalid_field", field: "nominalHz" }] },
        ok: false,
      },
    );
  });
});
