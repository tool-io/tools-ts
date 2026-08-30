import { describe, expect, it } from "vitest";
import {
  anglageLaborBudgetExample,
  calculateAnglageLaborBudget,
  runAnglageLaborBudget,
} from "./tool.js";

describe("anglage labor-budget calculator", () => {
  it("reproduces the canonical eight-part quote", () => {
    expect(runAnglageLaborBudget(anglageLaborBudgetExample.input)).toEqual({
      ok: true,
      output: anglageLaborBudgetExample.output,
    });
  });

  it("supports a zero-hour setup", () => {
    expect(
      calculateAnglageLaborBudget({
        partCount: 2,
        quotedHoursPerPart: 1.5,
        setupHours: 0,
        laborRatePerHour: 100,
      }).totalHoursIncludingSetup,
    ).toBe(3);
  });

  it("supports a zero labor rate for time-only quoting", () => {
    expect(
      calculateAnglageLaborBudget({
        partCount: 2,
        quotedHoursPerPart: 1,
        setupHours: 1,
        laborRatePerHour: 0,
      }).laborCost,
    ).toBe(0);
  });

  it("rejects a zero part count", () => {
    expect(
      runAnglageLaborBudget({
        partCount: 0,
        quotedHoursPerPart: 1,
        setupHours: 0,
        laborRatePerHour: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "partCount" }] },
      ok: false,
    });
  });

  it("rejects negative quoted hours", () => {
    expect(
      runAnglageLaborBudget({
        partCount: 1,
        quotedHoursPerPart: -1,
        setupHours: 0,
        laborRatePerHour: 100,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "quotedHoursPerPart" }],
      },
      ok: false,
    });
  });
});
