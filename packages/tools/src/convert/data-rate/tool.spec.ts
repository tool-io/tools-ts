import { describe, expect, it } from "vitest";
import { convertDataRate, dataRateExample, runDataRate } from "./tool.js";

describe("Convert Data Rate", () => {
  it("converts the canonical example", () =>
    expect(
      convertDataRate(
        dataRateExample.input.value,
        dataRateExample.input.fromUnit,
        dataRateExample.input.toUnit,
      ),
    ).toBeCloseTo(dataRateExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertDataRate(3, "b/s", "b/s")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertDataRate(1, "unknown", "b/s")).toBeNull();
    expect(convertDataRate(Number.NaN, "b/s", "b/s")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runDataRate(dataRateExample.input)).toEqual({
      ok: true,
      output: dataRateExample.output,
    }));
});
