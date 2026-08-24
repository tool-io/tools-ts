import { describe, expect, it } from "vitest";
import {
  calculateDuplicateHashSavingsMbCalculator,
  duplicateHashSavingsMbCalculatorExample,
  runDuplicateHashSavingsMbCalculator,
} from "./tool.js";

describe("archival-studies/duplicate-hash-savings-mb-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDuplicateHashSavingsMbCalculator(
        duplicateHashSavingsMbCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: duplicateHashSavingsMbCalculatorExample.output,
    });
  });

  it("reports zero savings for a fully unique set", () => {
    const result = calculateDuplicateHashSavingsMbCalculator({
      totalSizeMb: 900,
      uniqueSizeMb: 900,
    });
    expect(result.savedMb).toBe(0);
    expect(result.savingsPercent).toBe(0);
  });

  it("rejects unique sizes above the total", () => {
    expect(
      runDuplicateHashSavingsMbCalculator({
        totalSizeMb: 100,
        uniqueSizeMb: 150,
      }).ok,
    ).toBe(false);
  });
});
