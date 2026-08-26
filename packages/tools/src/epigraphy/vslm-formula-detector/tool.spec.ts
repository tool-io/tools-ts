import { describe, expect, it } from "vitest";
import { vslmFormulaDetectorExample, runVslmFormulaDetector } from "./tool.js";

describe("vslm-formula-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVslmFormulaDetector(vslmFormulaDetectorExample.input)).toEqual({
      ok: true,
      output: vslmFormulaDetectorExample.output,
    });
  });

  it("classifies the laetus variant", () => {
    const r = runVslmFormulaDetector({ text: "Votum solvit laetus merito" });
    expect(r.ok && r.output.variant === "laetus").toBe(true);
  });
  it("reports absence gracefully", () => {
    const r = runVslmFormulaDetector({ text: "nothing here" });
    expect(r.ok && !r.output.present).toBe(true);
  });
});
