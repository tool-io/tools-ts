import { describe, expect, it } from "vitest";
import {
  calculateFinalAverageSalary,
  finalAverageSalaryExample,
  runFinalAverageSalary,
} from "./tool.js";

describe("final average salary calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFinalAverageSalary(finalAverageSalaryExample.input)).toEqual({
      ok: true,
      output: finalAverageSalaryExample.output,
    });
  });

  it("defaults to the final three salary years", () => {
    expect(
      calculateFinalAverageSalary({ salaryHistory: [100, 200, 300, 400] }),
    ).toEqual({ finalAverageSalary: 300 });
  });

  it("supports a one-year averaging window", () => {
    expect(
      calculateFinalAverageSalary({
        averagingYears: 1,
        salaryHistory: [100, 200],
      }),
    ).toEqual({ finalAverageSalary: 200 });
  });

  it("rejects invalid windows and salaries", () => {
    expect(
      runFinalAverageSalary({ averagingYears: 5, salaryHistory: [100, 200] }),
    ).toMatchObject({
      error: {
        issues: [{ code: "averaging_window_invalid", field: "averagingYears" }],
      },
      ok: false,
    });
    expect(
      runFinalAverageSalary({ salaryHistory: [100, -1, 200] }),
    ).toMatchObject({
      error: {
        issues: [{ code: "salary_history_invalid", field: "salaryHistory" }],
      },
      ok: false,
    });
  });
});
