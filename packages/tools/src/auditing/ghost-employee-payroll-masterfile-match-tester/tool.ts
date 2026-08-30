import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GhostEmployeeInput = {
  readonly activePayrollFlags: ReadonlyArray<number>;
  readonly bankAccounts: ReadonlyArray<string>;
  readonly employeeIds: ReadonlyArray<string>;
};

export type GhostEmployeeOutput = {
  readonly activeWithoutBankAccountCount: number;
  readonly duplicateBankAccounts: ReadonlyArray<string>;
  readonly duplicateEmployeeIds: ReadonlyArray<string>;
};

export const testGhostEmployeeMatches = (
  input: GhostEmployeeInput,
): GhostEmployeeOutput => {
  if (
    !Array.isArray(input.employeeIds) ||
    !Array.isArray(input.bankAccounts) ||
    !Array.isArray(input.activePayrollFlags)
  )
    simpleError(
      "",
      "Employee IDs, bank accounts, and payroll flags must be arrays.",
      "employee_data_required",
    );
  if (
    input.employeeIds.length === 0 ||
    input.employeeIds.length !== input.bankAccounts.length ||
    input.employeeIds.length !== input.activePayrollFlags.length
  )
    simpleError(
      "",
      "Each employee must have a bank account and active-payroll flag.",
      "employee_data_length_mismatch",
    );
  const employeeIds = new Set<string>();
  const bankAccounts = new Set<string>();
  const duplicateEmployeeIds = new Set<string>();
  const duplicateBankAccounts = new Set<string>();
  let activeWithoutBankAccountCount = 0;
  for (const [index, employeeId] of input.employeeIds.entries()) {
    if (typeof employeeId !== "string" || employeeId.trim() === "")
      simpleError(
        `employeeIds.${index}`,
        "Employee IDs must be nonempty strings.",
        "invalid_employee_id",
      );
    const employeeKey = employeeId.trim().toLowerCase();
    if (employeeIds.has(employeeKey)) duplicateEmployeeIds.add(employeeKey);
    employeeIds.add(employeeKey);
    const bankAccount = input.bankAccounts[index];
    if (typeof bankAccount !== "string")
      simpleError(
        `bankAccounts.${index}`,
        "Bank accounts must be strings.",
        "invalid_bank_account",
      );
    const bankKey = bankAccount.trim().toLowerCase();
    if (bankKey !== "") {
      if (bankAccounts.has(bankKey)) duplicateBankAccounts.add(bankKey);
      bankAccounts.add(bankKey);
    }
    const active = input.activePayrollFlags[index];
    if (active !== 0 && active !== 1)
      simpleError(
        `activePayrollFlags.${index}`,
        "Active-payroll flags must be 0 or 1.",
        "invalid_payroll_flag",
      );
    if (active === 1 && bankKey === "") activeWithoutBankAccountCount += 1;
  }
  return {
    activeWithoutBankAccountCount,
    duplicateBankAccounts: [...duplicateBankAccounts].sort(),
    duplicateEmployeeIds: [...duplicateEmployeeIds].sort(),
  };
};

export const ghostEmployeeExample = {
  input: {
    activePayrollFlags: [1, 1, 0],
    bankAccounts: ["ACCT-1", "acct-1", ""],
    employeeIds: ["E-1", "E-2", "E-3"],
  },
  output: {
    activeWithoutBankAccountCount: 0,
    duplicateBankAccounts: ["acct-1"],
    duplicateEmployeeIds: [],
  },
} satisfies ToolExample<GhostEmployeeInput, GhostEmployeeOutput>;

export const ghostEmployeeTool = createSimpleTool({
  calculate: (input) =>
    testGhostEmployeeMatches({
      activePayrollFlags: input.activePayrollFlags as number[],
      bankAccounts: input.bankAccounts as string[],
      employeeIds: input.employeeIds as string[],
    }),
  description:
    "Screen payroll employee IDs and bank accounts for duplicate identities or accounts and active employees without supplied bank-account data.",
  id: "auditing/ghost-employee-payroll-masterfile-match-tester",
  inputs: [
    {
      description: "One binary active-payroll flag for each employee.",
      id: "activePayrollFlags",
      kind: "numberList",
      label: "Active payroll flags",
    },
    {
      description:
        "Bank-account value for each employee; an empty string means missing.",
      id: "bankAccounts",
      kind: "stringList",
      label: "Bank accounts",
    },
    {
      description: "One payroll employee ID for each row.",
      id: "employeeIds",
      kind: "stringList",
      label: "Employee IDs",
    },
  ],
  outputs: [
    {
      id: "activeWithoutBankAccountCount",
      kind: "integer",
      label: "Active without bank account",
      minimum: 0,
    },
    {
      id: "duplicateBankAccounts",
      kind: "stringList",
      label: "Duplicate bank accounts",
    },
    {
      id: "duplicateEmployeeIds",
      kind: "stringList",
      label: "Duplicate employee IDs",
    },
  ],
  title: "Ghost Employee Payroll Masterfile Match Tester",
});

export const runGhostEmployee = ghostEmployeeTool.execute;
export default ghostEmployeeTool;
