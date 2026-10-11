import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseTransfer: number;
  readonly suppliedHouseholdWeight: number;
};
export type Output = { readonly weightedTransfer: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseTransfer: { type: "number", minimum: 0 },
    suppliedHouseholdWeight: { type: "number", minimum: 0 },
  },
  required: ["baseTransfer", "suppliedHouseholdWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedTransfer: { type: "number" } },
  required: ["weightedTransfer"],
} as const;
/** Apply an explicitly supplied household-size weight to a base transfer without selecting an equivalence scale or entitlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseTransfer, suppliedHouseholdWeight } = request;
  const compute = (): Output => {
    H.domain(baseTransfer >= 0 && suppliedHouseholdWeight >= 0, "baseTransfer");
    return { weightedTransfer: baseTransfer * suppliedHouseholdWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseTransfer: 100, suppliedHouseholdWeight: 1.5 },
  output: { weightedTransfer: 150 },
} satisfies ToolExample<Input, Output>;
export const policyTransferHouseholdSizeWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["public-policy", "public policy", "social sciences"],
      keywords: ["public policy", "social sciences"],
    },
    id: "public-policy/policy-transfer-household-size-weight",
    title: "Policy Transfer Household Size Weight",
    description:
      "Apply an explicitly supplied household-size weight to a base transfer without selecting an equivalence scale or entitlement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseTransfer: { type: "number", minimum: 0 },
        suppliedHouseholdWeight: { type: "number", minimum: 0 },
      },
      required: ["baseTransfer", "suppliedHouseholdWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedTransfer: { type: "number" } },
      required: ["weightedTransfer"],
    },
    ports: {
      inputs: [
        {
          id: "baseTransfer",
          label: "Base Transfer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHouseholdWeight",
          label: "Supplied Household Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedTransfer",
          label: "Weighted Transfer",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyTransferHouseholdSizeWeightTool.execute;
export default policyTransferHouseholdSizeWeightTool;
