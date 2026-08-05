import { describe, expect, it } from "vitest";
import {
  convertAmountOfSubstance,
  amountOfSubstanceExample,
  runAmountOfSubstance,
} from "./tool.js";

describe("Convert Amount of Substance", () => {
  it("converts the canonical example", () =>
    expect(
      convertAmountOfSubstance(
        amountOfSubstanceExample.input.value,
        amountOfSubstanceExample.input.fromUnit,
        amountOfSubstanceExample.input.toUnit,
      ),
    ).toBeCloseTo(amountOfSubstanceExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertAmountOfSubstance(3, "mol", "mol")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertAmountOfSubstance(1, "unknown", "mol")).toBeNull();
    expect(convertAmountOfSubstance(Number.NaN, "mol", "mol")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runAmountOfSubstance(amountOfSubstanceExample.input)).toEqual({
      ok: true,
      output: amountOfSubstanceExample.output,
    }));
});
