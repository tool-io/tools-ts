import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCredit: number;
  readonly addedCredit: number;
  readonly chargedAmount: number;
};
export type Output = { readonly remainingCredit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCredit: { type: "number", minimum: 0 },
    addedCredit: { type: "number", minimum: 0 },
    chargedAmount: { type: "number", minimum: 0 },
  },
  required: ["openingCredit", "addedCredit", "chargedAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingCredit: { type: "number" } },
  required: ["remainingCredit"],
} as const;
/** Update one supplied farm customer prepaid balance with explicit credit additions and charges, preserving overdrafts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCredit, addedCredit, chargedAmount } = request;
  const compute = (): Output => {
    H.domain(openingCredit >= 0, "openingCredit");
    H.domain(addedCredit >= 0, "addedCredit");
    H.domain(chargedAmount >= 0, "chargedAmount");
    return { remainingCredit: openingCredit + addedCredit - chargedAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingCredit: 100, addedCredit: 50, chargedAmount: 80 },
  output: { remainingCredit: 70 },
} satisfies ToolExample<Input, Output>;
export const farmCustomerPrepaidBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/farm-customer-prepaid-balance",
    title: "Farm Customer Prepaid Balance",
    description:
      "Update one supplied farm customer prepaid balance with explicit credit additions and charges, preserving overdrafts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCredit: { type: "number", minimum: 0 },
        addedCredit: { type: "number", minimum: 0 },
        chargedAmount: { type: "number", minimum: 0 },
      },
      required: ["openingCredit", "addedCredit", "chargedAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingCredit: { type: "number" } },
      required: ["remainingCredit"],
    },
    ports: {
      inputs: [
        {
          id: "openingCredit",
          label: "Opening Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedCredit",
          label: "Added Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chargedAmount",
          label: "Charged Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingCredit",
          label: "Remaining Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmCustomerPrepaidBalanceTool.execute;
export default farmCustomerPrepaidBalanceTool;
