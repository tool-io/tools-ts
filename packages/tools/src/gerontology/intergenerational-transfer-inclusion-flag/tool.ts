import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashTransfer: number;
  readonly inKindValue: number;
  readonly sharedExpense: number;
  readonly includeInKind: boolean;
  readonly deductShared: boolean;
};
export type Output = { readonly reportedTransfer: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashTransfer: { type: "number", minimum: 0 },
    inKindValue: { type: "number", minimum: 0 },
    sharedExpense: { type: "number", minimum: 0 },
    includeInKind: { type: "boolean" },
    deductShared: { type: "boolean" },
  },
  required: [
    "cashTransfer",
    "inKindValue",
    "sharedExpense",
    "includeInKind",
    "deductShared",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reportedTransfer: { type: "number" } },
  required: ["reportedTransfer"],
} as const;
/** Calculate intergenerational transfer inclusion flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    cashTransfer,
    inKindValue,
    sharedExpense,
    includeInKind,
    deductShared,
  } = request;
  const compute = (): Output => {
    H.domain(cashTransfer >= 0 && inKindValue >= 0 && sharedExpense >= 0);
    return {
      reportedTransfer:
        cashTransfer +
        (includeInKind ? inKindValue : 0) -
        (deductShared ? sharedExpense : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cashTransfer: 100,
    inKindValue: 30,
    sharedExpense: 10,
    includeInKind: true,
    deductShared: true,
  },
  output: { reportedTransfer: 120 },
} satisfies ToolExample<Input, Output>;
export const intergenerationalTransferInclusionFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/intergenerational-transfer-inclusion-flag",
      title: "Intergenerational Transfer Inclusion Flag Tool",
      description:
        "Calculate intergenerational transfer inclusion flag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cashTransfer: { type: "number", minimum: 0 },
          inKindValue: { type: "number", minimum: 0 },
          sharedExpense: { type: "number", minimum: 0 },
          includeInKind: { type: "boolean" },
          deductShared: { type: "boolean" },
        },
        required: [
          "cashTransfer",
          "inKindValue",
          "sharedExpense",
          "includeInKind",
          "deductShared",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { reportedTransfer: { type: "number" } },
        required: ["reportedTransfer"],
      },
      ports: {
        inputs: [
          {
            id: "cashTransfer",
            label: "Cash Transfer",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inKindValue",
            label: "In Kind Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sharedExpense",
            label: "Shared Expense",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includeInKind",
            label: "Include In Kind",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "deductShared",
            label: "Deduct Shared",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "reportedTransfer",
            label: "Reported Transfer",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = intergenerationalTransferInclusionFlagTool.execute;
export default intergenerationalTransferInclusionFlagTool;
