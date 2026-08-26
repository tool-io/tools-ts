import { describe, expect, it } from "vitest";
import {
  heirsFormulaVariantCheckerExample,
  runHeirsFormulaVariantChecker,
} from "./tool.js";

describe("heirs-formula-variant-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHeirsFormulaVariantChecker(heirsFormulaVariantCheckerExample.input),
    ).toEqual({
      ok: true,
      output: heirsFormulaVariantCheckerExample.output,
    });
  });

  it("recognizes classical sibi without debit forms", () => {
    const r = runHeirsFormulaVariantChecker({ text: "sibi monumentum" });
    expect(
      r.ok && r.output.spelling === "classical-sibi" && !r.output.hasDebitForm,
    ).toBe(true);
  });
  it("reports none when absent", () => {
    const r = runHeirsFormulaVariantChecker({ text: "x" });
    expect(r.ok && r.output.spelling === "none").toBe(true);
  });
});
