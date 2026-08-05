import { describe, expect, it } from "vitest";
import { convertTime, timeExample, runTime } from "./tool.js";

describe("Convert Time", () => {
  it("converts the canonical example", () =>
    expect(
      convertTime(
        timeExample.input.value,
        timeExample.input.fromUnit,
        timeExample.input.toUnit,
      ),
    ).toBeCloseTo(timeExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertTime(3, "s", "s")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertTime(1, "unknown", "s")).toBeNull();
    expect(convertTime(Number.NaN, "s", "s")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runTime(timeExample.input)).toEqual({
      ok: true,
      output: timeExample.output,
    }));
});
