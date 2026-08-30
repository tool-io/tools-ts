import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FictitiousVendorInput = {
  readonly activeFlags: ReadonlyArray<number>;
  readonly bankAccounts: ReadonlyArray<string>;
  readonly taxIds: ReadonlyArray<string>;
  readonly vendorIds: ReadonlyArray<string>;
};

export type FictitiousVendorOutput = {
  readonly duplicateBankAccounts: ReadonlyArray<string>;
  readonly duplicateTaxIds: ReadonlyArray<string>;
  readonly incompleteActiveCount: number;
  readonly vendorCount: number;
};

export const detectFictitiousVendorDuplicates = (
  input: FictitiousVendorInput,
): FictitiousVendorOutput => {
  if (
    !Array.isArray(input.vendorIds) ||
    !Array.isArray(input.taxIds) ||
    !Array.isArray(input.bankAccounts) ||
    !Array.isArray(input.activeFlags)
  )
    simpleError(
      "",
      "Vendor IDs, tax IDs, bank accounts, and active flags must be arrays.",
      "vendor_data_required",
    );
  if (
    input.vendorIds.length === 0 ||
    input.vendorIds.length !== input.taxIds.length ||
    input.vendorIds.length !== input.bankAccounts.length ||
    input.vendorIds.length !== input.activeFlags.length
  )
    simpleError(
      "",
      "Each vendor must have a tax ID, bank account, and active flag.",
      "vendor_data_length_mismatch",
    );
  const taxIds = new Set<string>();
  const bankAccounts = new Set<string>();
  const duplicateTaxIds = new Set<string>();
  const duplicateBankAccounts = new Set<string>();
  let incompleteActiveCount = 0;
  for (const [index, vendorId] of input.vendorIds.entries()) {
    if (typeof vendorId !== "string" || vendorId.trim() === "")
      simpleError(
        `vendorIds.${index}`,
        "Vendor IDs must be nonempty strings.",
        "invalid_vendor_id",
      );
    const taxId = input.taxIds[index];
    const bankAccount = input.bankAccounts[index];
    const active = input.activeFlags[index];
    if (typeof taxId !== "string")
      simpleError(
        `taxIds.${index}`,
        "Tax IDs must be strings.",
        "invalid_tax_id",
      );
    if (typeof bankAccount !== "string")
      simpleError(
        `bankAccounts.${index}`,
        "Bank accounts must be strings.",
        "invalid_bank_account",
      );
    if (active !== 0 && active !== 1)
      simpleError(
        `activeFlags.${index}`,
        "Active flags must be 0 or 1.",
        "invalid_active_flag",
      );
    const taxKey = taxId.trim().toLowerCase();
    const bankKey = bankAccount.trim().toLowerCase();
    if (taxKey !== "") {
      if (taxIds.has(taxKey)) duplicateTaxIds.add(taxKey);
      taxIds.add(taxKey);
    }
    if (bankKey !== "") {
      if (bankAccounts.has(bankKey)) duplicateBankAccounts.add(bankKey);
      bankAccounts.add(bankKey);
    }
    if (active === 1 && (taxKey === "" || bankKey === ""))
      incompleteActiveCount += 1;
  }
  return {
    duplicateBankAccounts: [...duplicateBankAccounts].sort(),
    duplicateTaxIds: [...duplicateTaxIds].sort(),
    incompleteActiveCount,
    vendorCount: input.vendorIds.length,
  };
};

export const fictitiousVendorExample = {
  input: {
    activeFlags: [1, 1, 0],
    bankAccounts: ["BANK-1", "bank-1", ""],
    taxIds: ["TAX-1", "TAX-2", ""],
    vendorIds: ["V-1", "V-2", "V-3"],
  },
  output: {
    duplicateBankAccounts: ["bank-1"],
    duplicateTaxIds: [],
    incompleteActiveCount: 0,
    vendorCount: 3,
  },
} satisfies ToolExample<FictitiousVendorInput, FictitiousVendorOutput>;

export const fictitiousVendorTool = createSimpleTool({
  calculate: (input) =>
    detectFictitiousVendorDuplicates({
      activeFlags: input.activeFlags as number[],
      bankAccounts: input.bankAccounts as string[],
      taxIds: input.taxIds as string[],
      vendorIds: input.vendorIds as string[],
    }),
  description:
    "Screen vendor master records for duplicate normalized tax IDs or bank accounts and active vendors missing either supplied identifier.",
  id: "auditing/fictitious-vendor-w9-bank-duplicate-detector",
  inputs: [
    {
      description: "One binary active-vendor flag for each record.",
      id: "activeFlags",
      kind: "numberList",
      label: "Active flags",
    },
    {
      description:
        "Bank-account value for each vendor; an empty string means missing.",
      id: "bankAccounts",
      kind: "stringList",
      label: "Bank accounts",
    },
    {
      description:
        "Tax identifier for each vendor; an empty string means missing.",
      id: "taxIds",
      kind: "stringList",
      label: "Tax IDs",
    },
    {
      description: "One vendor-master identifier for each row.",
      id: "vendorIds",
      kind: "stringList",
      label: "Vendor IDs",
    },
  ],
  outputs: [
    {
      id: "duplicateBankAccounts",
      kind: "stringList",
      label: "Duplicate bank accounts",
    },
    { id: "duplicateTaxIds", kind: "stringList", label: "Duplicate tax IDs" },
    {
      id: "incompleteActiveCount",
      kind: "integer",
      label: "Incomplete active vendors",
      minimum: 0,
    },
    {
      id: "vendorCount",
      kind: "integer",
      label: "Vendors checked",
      minimum: 1,
    },
  ],
  title: "Fictitious Vendor W-9 Bank Duplicate Detector",
});

export const runFictitiousVendor = fictitiousVendorTool.execute;
export default fictitiousVendorTool;
