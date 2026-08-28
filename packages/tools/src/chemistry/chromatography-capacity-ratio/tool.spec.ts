import { describe, expect, it } from "vitest";
import { runCapacityRatio, capacityRatioExample } from "./tool.js";
describe("Capacity Ratio k2/k1", () => {
  it("publishes an executable example", () =>
    expect(runCapacityRatio(capacityRatioExample.input)).toEqual({
      ok: true,
      output: capacityRatioExample.output,
    }));
  it("returns one for equal capacity factors", () =>
    expect(
      runCapacityRatio({ capacityFactor1: 4.5, capacityFactor2: 4.5 }),
    ).toEqual({ ok: true, output: { capacityRatio: 1 } }));
  it("handles fractional capacity factors", () =>
    expect(
      runCapacityRatio({ capacityFactor1: 0.5, capacityFactor2: 1.25 }),
    ).toEqual({ ok: true, output: { capacityRatio: 2.5 } }));
  it("rejects a zero first capacity factor", () =>
    expect(
      runCapacityRatio({ capacityFactor1: 0, capacityFactor2: 6 }).ok,
    ).toBe(false));
  it("rejects a negative second capacity factor", () =>
    expect(
      runCapacityRatio({ capacityFactor1: 2, capacityFactor2: -6 }).ok,
    ).toBe(false));
});
