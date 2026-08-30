import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BlockchainConfirmationInput = {
  readonly addressVerified: boolean;
  readonly confirmationFromIndependentSource: boolean;
  readonly publicKeyVerified: boolean;
  readonly reconciliationComplete: boolean;
  readonly transactionFinalityEstablished: boolean;
};

export type BlockchainConfirmationOutput = {
  readonly assessment: "conditional" | "strong" | "weak";
  readonly criteriaMet: number;
  readonly criterionCount: number;
};

export const assessBlockchainConfirmationReliability = (
  input: BlockchainConfirmationInput,
): BlockchainConfirmationOutput => {
  const criteria: readonly (readonly [
    keyof BlockchainConfirmationInput,
    boolean,
  ])[] = [
    [
      "confirmationFromIndependentSource",
      input.confirmationFromIndependentSource,
    ],
    ["publicKeyVerified", input.publicKeyVerified],
    ["addressVerified", input.addressVerified],
    ["transactionFinalityEstablished", input.transactionFinalityEstablished],
    ["reconciliationComplete", input.reconciliationComplete],
  ];
  for (const [field, present] of criteria)
    if (typeof present !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  const criteriaMet = criteria.filter(([, present]) => present).length;
  return {
    assessment:
      criteriaMet === criteria.length
        ? "strong"
        : criteriaMet >= Math.ceil(criteria.length / 2)
          ? "conditional"
          : "weak",
    criteriaMet,
    criterionCount: criteria.length,
  };
};

export const blockchainConfirmationExample = {
  input: {
    addressVerified: true,
    confirmationFromIndependentSource: true,
    publicKeyVerified: true,
    reconciliationComplete: true,
    transactionFinalityEstablished: false,
  },
  output: { assessment: "conditional", criteriaMet: 4, criterionCount: 5 },
} satisfies ToolExample<
  BlockchainConfirmationInput,
  BlockchainConfirmationOutput
>;

export const blockchainConfirmationTool = createSimpleTool({
  calculate: (input) =>
    assessBlockchainConfirmationReliability({
      addressVerified: input.addressVerified as boolean,
      confirmationFromIndependentSource:
        input.confirmationFromIndependentSource as boolean,
      publicKeyVerified: input.publicKeyVerified as boolean,
      reconciliationComplete: input.reconciliationComplete as boolean,
      transactionFinalityEstablished:
        input.transactionFinalityEstablished as boolean,
    }),
  description:
    "Assess supplied blockchain confirmation independence, key, address, finality, and reconciliation facts without treating a ledger entry as inherently sufficient evidence.",
  id: "auditing/blockchain-ledger-direct-confirmation-reliability-note-lookup",
  inputs: [
    { id: "addressVerified", kind: "boolean", label: "Address verified" },
    {
      id: "confirmationFromIndependentSource",
      kind: "boolean",
      label: "Independent confirmation",
    },
    { id: "publicKeyVerified", kind: "boolean", label: "Public key verified" },
    {
      id: "reconciliationComplete",
      kind: "boolean",
      label: "Reconciliation complete",
    },
    {
      id: "transactionFinalityEstablished",
      kind: "boolean",
      label: "Transaction finality established",
    },
  ],
  outputs: [
    {
      enum: ["conditional", "strong", "weak"],
      id: "assessment",
      kind: "string",
      label: "Reliability assessment",
    },
    {
      id: "criteriaMet",
      kind: "integer",
      label: "Criteria met",
      minimum: 0,
    },
    {
      id: "criterionCount",
      kind: "integer",
      label: "Criteria checked",
      minimum: 5,
    },
  ],
  title: "Blockchain Ledger Direct Confirmation Reliability Note Lookup",
});

export const runBlockchainConfirmation = blockchainConfirmationTool.execute;
export default blockchainConfirmationTool;
