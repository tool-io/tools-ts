import { describe, expect, it } from "vitest";
import {
  junctionLeakageCurrentExample,
  runJunctionLeakageCurrent,
} from "./tool.js";

describe("Junction Leakage Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runJunctionLeakageCurrent(junctionLeakageCurrentExample.input),
    ).toEqual({
      ok: true,
      output: junctionLeakageCurrentExample.output,
    }));

  it("scales leakage linearly with junction area", () => {
    const small = runJunctionLeakageCurrent({
      junctionAreaUm2: 1,
      saturationCurrentDensityPicoAPerUm2: 0.5,
    });
    const large = runJunctionLeakageCurrent({
      junctionAreaUm2: 10,
      saturationCurrentDensityPicoAPerUm2: 0.5,
    });
    expect(small.ok).toBe(true);
    expect(large.ok).toBe(true);
    if (!small.ok || !large.ok) return;
    const smallValue = small.output.leakagePicoAmperes as number;
    const largeValue = large.output.leakagePicoAmperes as number;
    expect(largeValue).toBeCloseTo(10 * smallValue, 15);
  });

  it("yields zero leakage for zero current density", () =>
    expect(
      runJunctionLeakageCurrent({
        junctionAreaUm2: 4,
        saturationCurrentDensityPicoAPerUm2: 0,
      }),
    ).toEqual({ ok: true, output: { leakagePicoAmperes: 0 } }));

  it("handles very small densities without underflow surprises", () => {
    const result = runJunctionLeakageCurrent({
      junctionAreaUm2: 1e10,
      saturationCurrentDensityPicoAPerUm2: 1e-12,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.leakagePicoAmperes).toBeCloseTo(0.01, 15);
  });

  it("rejects a negative current density", () =>
    expect(
      runJunctionLeakageCurrent({
        junctionAreaUm2: 2,
        saturationCurrentDensityPicoAPerUm2: -0.5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "saturationCurrentDensityPicoAPerUm2",
          },
        ],
      },
      ok: false,
    }));

  it("rejects zero junction area", () =>
    expect(
      runJunctionLeakageCurrent({
        junctionAreaUm2: 0,
        saturationCurrentDensityPicoAPerUm2: 0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects a negative junction area", () =>
    expect(
      runJunctionLeakageCurrent({
        junctionAreaUm2: -3,
        saturationCurrentDensityPicoAPerUm2: 0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects a non-finite area", () =>
    expect(
      runJunctionLeakageCurrent({
        junctionAreaUm2: Number.POSITIVE_INFINITY,
        saturationCurrentDensityPicoAPerUm2: 0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "junctionAreaUm2" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runJunctionLeakageCurrent({ junctionAreaUm2: 2 })).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "saturationCurrentDensityPicoAPerUm2",
          },
        ],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runJunctionLeakageCurrent({
        extra: 1,
        junctionAreaUm2: 2,
        saturationCurrentDensityPicoAPerUm2: 0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
