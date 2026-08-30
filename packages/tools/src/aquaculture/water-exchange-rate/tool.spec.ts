import { describe, expect, it } from "vitest";
import {
  calculateWaterExchangeRate,
  example,
  runWaterExchangeRate,
} from "./tool.js";

describe("aquaculture/water-exchange-rate", () => {
  it("calculates the published example", () => {
    expect(calculateWaterExchangeRate(example.input)).toEqual(example.output);
    expect(runWaterExchangeRate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runWaterExchangeRate({
      ...example.input,
      replacementVolumeCubicMetersPerDay: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runWaterExchangeRate({ ...example.input, systemVolumeCubicMeters: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "systemVolumeCubicMeters" }] },
    });
  });
});
