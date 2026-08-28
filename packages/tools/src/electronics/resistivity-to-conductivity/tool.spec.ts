import { describe, expect, it } from "vitest";
import {
  resistivityToConductivityExample,
  runResistivityToConductivity,
} from "./tool.js";

describe("Conductivity From Resistivity", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runResistivityToConductivity(resistivityToConductivityExample.input),
    ).toEqual({ ok: true, output: resistivityToConductivityExample.output }));

  it("inverts two ohm meters into half a siemen per meter", () =>
    expect(runResistivityToConductivity({ resistivityOhmM: 2 })).toEqual({
      ok: true,
      output: { conductivitySPersM: 0.5 },
    }));

  it("computes annealed copper conductivity from 1.72e-8 ohm meters", () =>
    expect(runResistivityToConductivity({ resistivityOhmM: 1.72e-8 })).toEqual({
      ok: true,
      output: { conductivitySPersM: 58139534.883720934 },
    }));

  it("multiplies back to one with the original resistivity", () => {
    const result = runResistivityToConductivity({ resistivityOhmM: 3.3 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Number(result.output.conductivitySPersM) * 3.3).toBeCloseTo(1);
  });

  it("rejects zero resistivity", () =>
    expect(runResistivityToConductivity({ resistivityOhmM: 0 })).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "resistivityOhmM" }],
      },
      ok: false,
    }));

  it("rejects negative resistivity", () =>
    expect(
      runResistivityToConductivity({ resistivityOhmM: -1.68e-8 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "resistivityOhmM" }],
      },
      ok: false,
    }));

  it("rejects non-finite resistivity", () =>
    expect(
      runResistivityToConductivity({
        resistivityOhmM: Number.POSITIVE_INFINITY,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "resistivityOhmM" }],
      },
      ok: false,
    }));
});
