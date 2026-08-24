import { describe, expect, it } from "vitest";
import {
  batardeMixProportionCalculatorExample,
  runBatardeMixProportionCalculator,
} from "./tool.js";

describe("batarde-mix-proportion-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBatardeMixProportionCalculator(
        batardeMixProportionCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: batardeMixProportionCalculatorExample.output,
    });
  });

  it("calls an even fifty-fifty mix balanced", () => {
    const result = runBatardeMixProportionCalculator({
      cursivaFormCount: 5,
      textualisFormCount: 5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.mixClassification).toBe("balanced_mix");
    expect(result.output.textualisSharePct as number).toBe(50);
  });

  it("rejects samples with no scored forms", () => {
    expect(
      runBatardeMixProportionCalculator({
        cursivaFormCount: 0,
        textualisFormCount: 0,
      }).ok,
    ).toBe(false);
  });
});
