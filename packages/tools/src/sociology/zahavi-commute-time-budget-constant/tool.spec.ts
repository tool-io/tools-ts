import { describe, expect, it } from "vitest";
import {
  calculateZahaviBudget,
  zahaviCommuteTimeBudgetExample,
  zahaviCommuteTimeBudgetTool,
  runZahaviCommuteTimeBudget,
} from "./tool.js";

describe("zahaviCommuteTimeBudgetTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runZahaviCommuteTimeBudget(zahaviCommuteTimeBudgetExample.input),
    ).toEqual({
      ok: true,
      output: zahaviCommuteTimeBudgetExample.output,
    });
  });

  it("reports the signed difference from the approximate one-hour budget", () => {
    expect(
      calculateZahaviBudget({ meanCommuteMinutes: 40, tripsPerDay: 2 }),
    ).toEqual({
      dailyBudgetMinutes: 80,
      differenceFromOneHourMinutes: 20,
    });
    const result = runZahaviCommuteTimeBudget({
      meanCommuteMinutes: 20,
      tripsPerDay: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("tripsPerDay");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(zahaviCommuteTimeBudgetExample))).toEqual(
      zahaviCommuteTimeBudgetExample,
    );
    expect(zahaviCommuteTimeBudgetTool.contractVersion).toBe(1);
    expect(zahaviCommuteTimeBudgetTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runZahaviCommuteTimeBudget(null).ok).toBe(false);
    expect(
      runZahaviCommuteTimeBudget({
        ...zahaviCommuteTimeBudgetExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
