import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BankConfirmationFieldsInput = {
  readonly accountNumberConfirmed: boolean;
  readonly bankAddressVerified: boolean;
  readonly bankContactIndependent: boolean;
  readonly authorizedSignerConfirmed: boolean;
  readonly balanceConfirmed: boolean;
};

export type BankConfirmationFieldsOutput = {
  readonly complete: boolean;
  readonly completedCount: number;
  readonly fieldCount: number;
  readonly missingFields: ReadonlyArray<string>;
};

export const checkBankConfirmationFields = (
  input: BankConfirmationFieldsInput,
): BankConfirmationFieldsOutput => {
  const fields: readonly (readonly [string, boolean])[] = [
    ["account number", input.accountNumberConfirmed],
    ["bank address", input.bankAddressVerified],
    ["bank contact independence", input.bankContactIndependent],
    ["authorized signer", input.authorizedSignerConfirmed],
    ["balance", input.balanceConfirmed],
  ];
  for (const [field, complete] of fields)
    if (typeof complete !== "boolean")
      simpleError(
        field.replaceAll(" ", ""),
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  const missingFields = fields
    .filter(([, complete]) => !complete)
    .map(([field]) => field);
  return {
    complete: missingFields.length === 0,
    completedCount: fields.length - missingFields.length,
    fieldCount: fields.length,
    missingFields,
  };
};

export const bankConfirmationFieldsExample = {
  input: {
    accountNumberConfirmed: true,
    bankAddressVerified: true,
    bankContactIndependent: true,
    authorizedSignerConfirmed: true,
    balanceConfirmed: false,
  },
  output: {
    complete: false,
    completedCount: 4,
    fieldCount: 5,
    missingFields: ["balance"],
  },
} satisfies ToolExample<
  BankConfirmationFieldsInput,
  BankConfirmationFieldsOutput
>;

export const bankConfirmationFieldsTool = createSimpleTool({
  calculate: (input) =>
    checkBankConfirmationFields({
      accountNumberConfirmed: input.accountNumberConfirmed as boolean,
      authorizedSignerConfirmed: input.authorizedSignerConfirmed as boolean,
      balanceConfirmed: input.balanceConfirmed as boolean,
      bankAddressVerified: input.bankAddressVerified as boolean,
      bankContactIndependent: input.bankContactIndependent as boolean,
    }),
  description:
    "Check supplied bank-confirmation records for account, address, independent contact, authorized-signer, and balance completion.",
  id: "auditing/bank-confirmation-form-standard-fields-completion-guide",
  inputs: [
    {
      id: "accountNumberConfirmed",
      kind: "boolean",
      label: "Account number confirmed",
    },
    {
      id: "authorizedSignerConfirmed",
      kind: "boolean",
      label: "Authorized signer confirmed",
    },
    { id: "balanceConfirmed", kind: "boolean", label: "Balance confirmed" },
    {
      id: "bankAddressVerified",
      kind: "boolean",
      label: "Bank address verified",
    },
    {
      id: "bankContactIndependent",
      kind: "boolean",
      label: "Bank contact independent",
    },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Confirmation complete" },
    {
      id: "completedCount",
      kind: "integer",
      label: "Fields complete",
      minimum: 0,
    },
    { id: "fieldCount", kind: "integer", label: "Fields checked", minimum: 5 },
    { id: "missingFields", kind: "stringList", label: "Missing fields" },
  ],
  title: "Bank Confirmation Form Standard Fields Completion Guide",
});

export const runBankConfirmationFields = bankConfirmationFieldsTool.execute;
export default bankConfirmationFieldsTool;
