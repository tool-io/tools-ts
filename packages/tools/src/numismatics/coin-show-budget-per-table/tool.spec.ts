import { describe, expect, it } from "vitest";
import {
  calculateCoinShowBudgetPerTable,
  example,
  runCoinShowBudgetPerTable,
} from "./tool.js";

describe("numismatics/coin-show-budget-per-table", () => {
  it("calculates the published example", () => {
    expect(calculateCoinShowBudgetPerTable(example.input)).toEqual(
      example.output,
    );
    expect(runCoinShowBudgetPerTable(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runCoinShowBudgetPerTable({
      ...example.input,
      totalShowBudget: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runCoinShowBudgetPerTable({ ...example.input, tableCount: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "tableCount" }] },
    });
  });
});
