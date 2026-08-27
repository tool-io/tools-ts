import { describe, expect, it } from "vitest";
import {
  vaporPressureDeficitPlantExample,
  runVaporPressureDeficitPlant,
} from "./tool.js";

describe("VPD Calculator", () => {
  it("matches the canonical example", () => {
    expect(
      runVaporPressureDeficitPlant(vaporPressureDeficitPlantExample.input),
    ).toEqual({ ok: true, output: vaporPressureDeficitPlantExample.output });
  });

  it("reports zero deficit at saturation", () => {
    expect(
      runVaporPressureDeficitPlant({
        saturationVaporPressureKpa: 3.17,
        actualVaporPressureKpa: 3.17,
      }),
    ).toEqual({ ok: true, output: { vaporPressureDeficitKpa: 0 } });
  });

  it("grows the deficit as air dries", () => {
    expect(
      runVaporPressureDeficitPlant({
        saturationVaporPressureKpa: 4.2,
        actualVaporPressureKpa: 1.2,
      }),
    ).toEqual({ ok: true, output: { vaporPressureDeficitKpa: 3 } });
  });

  it("handles fractional pressures near dew point", () => {
    expect(
      runVaporPressureDeficitPlant({
        saturationVaporPressureKpa: 1.704,
        actualVaporPressureKpa: 1.696,
      }),
    ).toEqual({
      ok: true,
      output: { vaporPressureDeficitKpa: 0.008000000000000007 },
    });
  });

  it("rejects supersaturation with a stable code", () => {
    const result = runVaporPressureDeficitPlant({
      saturationVaporPressureKpa: 1,
      actualVaporPressureKpa: 1.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_pressures",
        field: "saturationVaporPressureKpa",
      });
  });

  it("rejects non finite pressures through the schema", () => {
    expect(
      runVaporPressureDeficitPlant({
        saturationVaporPressureKpa: Number.POSITIVE_INFINITY,
        actualVaporPressureKpa: 1,
      }).ok,
    ).toBe(false);
    expect(
      runVaporPressureDeficitPlant({
        saturationVaporPressureKpa: 2,
        actualVaporPressureKpa: Number.NaN,
      }).ok,
    ).toBe(false);
  });

  it("rejects non object input through the schema", () => {
    expect(runVaporPressureDeficitPlant("vpd").ok).toBe(false);
  });
});
