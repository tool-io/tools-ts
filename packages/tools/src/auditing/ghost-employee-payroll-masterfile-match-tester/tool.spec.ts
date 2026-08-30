import { describe, expect, it } from "vitest";
import {
  ghostEmployeeExample,
  runGhostEmployee,
  testGhostEmployeeMatches,
} from "./tool.js";

describe("ghost employee payroll matcher", () => {
  it("reproduces its canonical example", () => {
    expect(runGhostEmployee(ghostEmployeeExample.input)).toEqual({
      ok: true,
      output: ghostEmployeeExample.output,
    });
  });

  it("detects duplicate normalized employee IDs", () => {
    expect(
      testGhostEmployeeMatches({
        activePayrollFlags: [1, 1],
        bankAccounts: ["A", "B"],
        employeeIds: ["E-1", " e-1 "],
      }).duplicateEmployeeIds,
    ).toEqual(["e-1"]);
  });

  it("counts active employees with missing bank accounts", () => {
    expect(
      testGhostEmployeeMatches({
        activePayrollFlags: [1, 0],
        bankAccounts: ["", "A"],
        employeeIds: ["E-1", "E-2"],
      }).activeWithoutBankAccountCount,
    ).toBe(1);
  });

  it("rejects mismatched employee data", () => {
    expect(
      runGhostEmployee({
        activePayrollFlags: [1],
        bankAccounts: ["A"],
        employeeIds: [],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "employee_data_length_mismatch", field: "" }] },
      ok: false,
    });
  });
});
