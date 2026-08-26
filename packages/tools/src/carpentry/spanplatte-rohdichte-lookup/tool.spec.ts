import { describe, expect, it } from "vitest";
import {
  runParticleBoardDensity,
  particleBoardDensityExample,
} from "./tool.js";

const run = runParticleBoardDensity;

describe("Particle Board Density Lookup", () => {
  it("reproduces its canonical example exactly", () =>
    expect(run(particleBoardDensityExample.input)).toEqual({
      ok: true,
      output: particleBoardDensityExample.output,
    }));

  it("classifies thin boards up to 13 mm as 700 kg/m³", () =>
    expect(run({ boardThicknessMm: 13 })).toEqual({
      ok: true,
      output: { nominalDensityKgPerCbm: 700 },
    }));

  it("classifies boards just above 13 mm as 650 kg/m³", () =>
    expect(run({ boardThicknessMm: 13.5 })).toEqual({
      ok: true,
      output: { nominalDensityKgPerCbm: 650 },
    }));

  it("classifies mid-range boards up to 25 mm as 650 kg/m³", () =>
    expect(run({ boardThicknessMm: 25 })).toEqual({
      ok: true,
      output: { nominalDensityKgPerCbm: 650 },
    }));

  it("classifies boards above 25 mm as 600 kg/m³", () =>
    expect(run({ boardThicknessMm: 25.1 })).toEqual({
      ok: true,
      output: { nominalDensityKgPerCbm: 600 },
    }));

  it("classifies very thick boards as 600 kg/m³", () =>
    expect(run({ boardThicknessMm: 40 })).toEqual({
      ok: true,
      output: { nominalDensityKgPerCbm: 600 },
    }));

  it("keeps the density non-increasing with thickness", () => {
    let previous = 700;
    for (const thickness of [8, 12, 13, 18, 24, 30]) {
      const result = run({ boardThicknessMm: thickness });
      expect(result.ok).toBe(true);
      if (result.ok) {
        const density = Number(result.output.nominalDensityKgPerCbm);
        expect(density).toBeLessThanOrEqual(previous);
        previous = density;
      }
    }
  });

  it("rejects a zero thickness with must_be_positive", () => {
    const result = run({ boardThicknessMm: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("must_be_positive");
  });

  it("rejects a negative thickness with must_be_positive", () => {
    const result = run({ boardThicknessMm: -19 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("must_be_positive");
  });

  it("rejects a missing thickness with invalid_field", () => {
    const result = run({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () =>
    expect(run({ boardThicknessMm: 19, extra: 1 } as never).ok).toBe(false));
});
