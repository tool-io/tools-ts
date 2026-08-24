import { describe, expect, it } from "vitest";
import {
  calculateDensityOfStatesEffective,
  densityOfStatesEffectiveExample,
  runDensityOfStatesEffective,
} from "./tool.js";
import type { DensityOfStatesEffectiveOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runDensityOfStatesEffective>,
): DensityOfStatesEffectiveOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as DensityOfStatesEffectiveOutput;
};

describe("Effective DOS Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDensityOfStatesEffective(densityOfStatesEffectiveExample.input),
    ).toEqual({ ok: true, output: densityOfStatesEffectiveExample.output });
    expect(
      calculateDensityOfStatesEffective(densityOfStatesEffectiveExample.input)
        .conductionBandDOSPerCm3,
    ).toBe(79195959492893330000);
  });

  it("returns the reference density at 300 K via runner and direct", () => {
    expect(runDensityOfStatesEffective({ temperatureK: 300 })).toEqual({
      ok: true,
      output: { conductionBandDOSPerCm3: 28000000000000000000 },
    });
    expect(
      calculateDensityOfStatesEffective({ temperatureK: 300 })
        .conductionBandDOSPerCm3,
    ).toBe(28000000000000000000);
  });

  it("drops to one eighth of the reference at a quarter temperature", () => {
    expect(runDensityOfStatesEffective({ temperatureK: 75 })).toEqual({
      ok: true,
      output: { conductionBandDOSPerCm3: 3500000000000000000 },
    });
    expect(
      calculateDensityOfStatesEffective({ temperatureK: 75 })
        .conductionBandDOSPerCm3,
    ).toBe(3500000000000000000);
  });

  it("rejects missing temperature", () => {
    const result = runDensityOfStatesEffective({} as never);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "temperatureK",
      });
  });

  it("rejects wrong type temperature", () => {
    expect(
      runDensityOfStatesEffective({ temperatureK: "600" as never }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateDensityOfStatesEffective({
        temperatureK: "600" as unknown as number,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it("rejects unknown input fields", () => {
    const result = runDensityOfStatesEffective({
      temperatureK: 300,
      nc: 1,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "nc",
      });
  });

  it("rejects non-object input", () => {
    const result = runDensityOfStatesEffective(600 as never);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues[0]?.code).toBe("object_required");
    }
    expect(runDensityOfStatesEffective(null as never).ok).toBe(false);
    expect(runDensityOfStatesEffective([] as never).ok).toBe(false);
  });

  it("rejects non-finite temperature via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(runDensityOfStatesEffective({ temperatureK: bad }).ok).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateDensityOfStatesEffective>[0];
      field: string;
    }> = [
      { input: { temperatureK: Number.NaN }, field: "temperatureK" },
      {
        input: { temperatureK: Number.POSITIVE_INFINITY },
        field: "temperatureK",
      },
      {
        input: { temperatureK: Number.NEGATIVE_INFINITY },
        field: "temperatureK",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateDensityOfStatesEffective(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects boundaries below 1 K and above 1000 K via schema and direct", () => {
    const low = runDensityOfStatesEffective({ temperatureK: 0 });
    expect(low.ok).toBe(false);
    if (!low.ok)
      expect(low.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "temperatureK",
      });
    const high = runDensityOfStatesEffective({ temperatureK: 1001 });
    expect(high.ok).toBe(false);
    if (!high.ok)
      expect(high.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "temperatureK",
      });
    expect(runDensityOfStatesEffective({ temperatureK: -10 }).ok).toBe(false);
    expect(runDensityOfStatesEffective({ temperatureK: 0.999 }).ok).toBe(false);

    let err: unknown = null;
    try {
      calculateDensityOfStatesEffective({ temperatureK: 0 });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("temperatureK");
    err = null;
    try {
      calculateDensityOfStatesEffective({ temperatureK: 1001 });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("temperatureK");
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateDensityOfStatesEffective({ temperatureK: 300 })
        .conductionBandDOSPerCm3,
    ).toBe(28000000000000000000);
    expect(
      calculateDensityOfStatesEffective({ temperatureK: 75 })
        .conductionBandDOSPerCm3,
    ).toBe(3500000000000000000);
    expect(() =>
      calculateDensityOfStatesEffective({ temperatureK: 0 }),
    ).toThrow();
    expect(() =>
      calculateDensityOfStatesEffective({ temperatureK: Number.NaN }),
    ).toThrow();
  });

  it("scales with the three-halves power of the temperature ratio", () => {
    const cold = outputOf(runDensityOfStatesEffective({ temperatureK: 150 }));
    const warm = outputOf(runDensityOfStatesEffective({ temperatureK: 600 }));
    expect(
      warm.conductionBandDOSPerCm3 / cold.conductionBandDOSPerCm3,
    ).toBeCloseTo(Math.pow(4, 1.5), 9);
    const directCold = calculateDensityOfStatesEffective({
      temperatureK: 150,
    }).conductionBandDOSPerCm3;
    const directWarm = calculateDensityOfStatesEffective({
      temperatureK: 600,
    }).conductionBandDOSPerCm3;
    expect(directWarm / directCold).toBeCloseTo(Math.pow(4, 1.5), 12);
  });

  it("is monotonic increasing with temperature and preserves inverse", () => {
    const lower = outputOf(
      runDensityOfStatesEffective({ temperatureK: 400 }),
    ).conductionBandDOSPerCm3;
    const higher = outputOf(
      runDensityOfStatesEffective({ temperatureK: 900 }),
    ).conductionBandDOSPerCm3;
    expect(higher).toBeGreaterThan(lower);
    const directLow = calculateDensityOfStatesEffective({
      temperatureK: 400,
    }).conductionBandDOSPerCm3;
    const directHigh = calculateDensityOfStatesEffective({
      temperatureK: 900,
    }).conductionBandDOSPerCm3;
    expect(directHigh).toBeGreaterThan(directLow);

    // inverse: T = 300*(Nc/2.8e19)^(2/3)
    const T = 600;
    const Nc = calculateDensityOfStatesEffective({
      temperatureK: T,
    }).conductionBandDOSPerCm3;
    const recoveredT = 300 * Math.pow(Nc / 2.8e19, 2 / 3);
    expect(recoveredT).toBeCloseTo(T, 9);
  });

  it("handles boundaries and preserves full precision without -0", () => {
    const min = calculateDensityOfStatesEffective({ temperatureK: 1 });
    expect(Number.isFinite(min.conductionBandDOSPerCm3)).toBe(true);
    expect(min.conductionBandDOSPerCm3).toBeGreaterThan(0);
    expect(Object.is(min.conductionBandDOSPerCm3, -0)).toBe(false);

    const max = calculateDensityOfStatesEffective({ temperatureK: 1000 });
    expect(Number.isFinite(max.conductionBandDOSPerCm3)).toBe(true);
    expect(max.conductionBandDOSPerCm3).toBeGreaterThan(
      min.conductionBandDOSPerCm3,
    );

    const direct = calculateDensityOfStatesEffective(
      densityOfStatesEffectiveExample.input,
    ).conductionBandDOSPerCm3;
    const viaRunner = outputOf(
      runDensityOfStatesEffective(densityOfStatesEffectiveExample.input),
    ).conductionBandDOSPerCm3;
    expect(direct).toBe(viaRunner);
    expect(direct).toBe(79195959492893330000);
    expect(direct.toString()).not.toContain("e");
  });
});
