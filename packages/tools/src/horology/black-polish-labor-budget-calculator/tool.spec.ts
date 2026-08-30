import { describe, expect, it } from "vitest";
import {
  blackPolishLaborBudgetExample,
  calculateBlackPolishLaborBudget,
  runBlackPolishLaborBudget,
} from "./tool.js";

describe("black-polish labor-budget calculator", () => {
  it("reproduces the canonical 10-percent contingency example", () => {
    expect(
      runBlackPolishLaborBudget(blackPolishLaborBudgetExample.input),
    ).toEqual({
      ok: true,
      output: blackPolishLaborBudgetExample.output,
    });
  });

  it("supports a zero contingency", () => {
    expect(
      calculateBlackPolishLaborBudget({
        partCount: 2,
        quotedHoursPerPart: 1,
        setupHours: 0,
        laborRatePerHour: 50,
        contingencyPercent: 0,
      }),
    ).toMatchObject({ budgetedHours: 2, budgetedLaborCost: 100 });
  });

  it("adds setup before applying contingency", () => {
    expect(
      calculateBlackPolishLaborBudget({
        partCount: 1,
        quotedHoursPerPart: 1,
        setupHours: 1,
        laborRatePerHour: 100,
        contingencyPercent: 100,
      }).budgetedHours,
    ).toBe(4);
  });

  it("rejects a zero part count", () => {
    expect(
      runBlackPolishLaborBudget({
        partCount: 0,
        quotedHoursPerPart: 1,
        setupHours: 0,
        laborRatePerHour: 50,
        contingencyPercent: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "partCount" }] },
      ok: false,
    });
  });

  it("rejects a negative contingency", () => {
    expect(
      runBlackPolishLaborBudget({
        partCount: 1,
        quotedHoursPerPart: 1,
        setupHours: 0,
        laborRatePerHour: 50,
        contingencyPercent: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "contingencyPercent" }],
      },
      ok: false,
    });
  });
});
