import { describe, expect, it } from "vitest";
import { convertEnergy, energyExample, runEnergy } from "./tool.js";

describe("Convert Energy", () => {
  it("converts the canonical example", () =>
    expect(
      convertEnergy(
        energyExample.input.value,
        energyExample.input.fromUnit,
        energyExample.input.toUnit,
      ),
    ).toBeCloseTo(energyExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertEnergy(3, "J", "J")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertEnergy(1, "unknown", "J")).toBeNull();
    expect(convertEnergy(Number.NaN, "J", "J")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runEnergy(energyExample.input)).toEqual({
      ok: true,
      output: energyExample.output,
    }));
});
