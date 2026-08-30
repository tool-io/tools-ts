import { describe, expect, it } from "vitest";
import { calculateDoSaturation, example, runDoSaturation } from "./tool.js";

describe("aquaculture/do-saturation", () => {
  it("calculates the published example", () => {
    expect(calculateDoSaturation(example.input)).toEqual(example.output);
    expect(runDoSaturation(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runDoSaturation({
      ...example.input,
      measuredOxygenMgPerLiter: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      calculateDoSaturation({
        measuredOxygenMgPerLiter: 6,
        saturationOxygenMgPerLiter: 8,
      }).oxygenSaturationPercent,
    ).toBe(75);
  });
  it("rejects a zero denominator", () => {
    expect(
      runDoSaturation({ ...example.input, saturationOxygenMgPerLiter: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "saturationOxygenMgPerLiter" }] },
    });
  });
});
