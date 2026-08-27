import { describe, expect, it } from "vitest";
import {
  runVaporPressureDeficitLeaf,
  vaporPressureDeficitLeafExample,
} from "./tool.js";

describe("Leaf VPD From RH", () => {
  it("publishes an executable example", () =>
    expect(
      runVaporPressureDeficitLeaf(vaporPressureDeficitLeafExample.input),
    ).toEqual({ ok: true, output: vaporPressureDeficitLeafExample.output }));
  it("returns the full saturation vapour pressure at zero humidity", () => {
    const result = runVaporPressureDeficitLeaf({
      leafTempC: 25,
      relativeHumidityPercent: 0,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.leafVpdKpa).toBeCloseTo(
        0.6108 * Math.exp((17.27 * 25) / 262.3),
        12,
      );
  });
  it("returns zero deficit at saturation", () =>
    expect(
      runVaporPressureDeficitLeaf({
        leafTempC: 20,
        relativeHumidityPercent: 100,
      }),
    ).toEqual({ ok: true, output: { leafVpdKpa: 0 } }));
  it("increases with temperature", () => {
    const cool = runVaporPressureDeficitLeaf({
      leafTempC: 10,
      relativeHumidityPercent: 50,
    });
    const warm = runVaporPressureDeficitLeaf({
      leafTempC: 30,
      relativeHumidityPercent: 50,
    });
    expect(cool.ok).toBe(true);
    expect(warm.ok).toBe(true);
    if (cool.ok && warm.ok)
      expect(Number(warm.output.leafVpdKpa)).toBeGreaterThan(
        Number(cool.output.leafVpdKpa),
      );
  });
  it("rejects temperatures outside -10 to 60", () =>
    expect(
      runVaporPressureDeficitLeaf({
        leafTempC: 61,
        relativeHumidityPercent: 50,
      }).ok,
    ).toBe(false));
  it("rejects humidity above one hundred", () =>
    expect(
      runVaporPressureDeficitLeaf({
        leafTempC: 25,
        relativeHumidityPercent: 101,
      }).ok,
    ).toBe(false));
});
