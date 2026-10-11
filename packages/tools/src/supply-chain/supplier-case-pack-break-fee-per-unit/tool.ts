import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedBreakFee: number;
  readonly unitsInBrokenPack: number;
};
export type Output = { readonly feePerUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedBreakFee: { type: "number", minimum: 0 },
    unitsInBrokenPack: { type: "integer", minimum: 1 },
  },
  required: ["suppliedBreakFee", "unitsInBrokenPack"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { feePerUnit: { type: "number" } },
  required: ["feePerUnit"],
} as const;
/** Allocate an explicit case-break fee over a supplied positive count of units without selecting supplier terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedBreakFee, unitsInBrokenPack } = request;
  const compute = (): Output => {
    H.domain(suppliedBreakFee >= 0, "suppliedBreakFee");
    (H.domain(
      Number.isSafeInteger(unitsInBrokenPack) &&
        unitsInBrokenPack >= 1 &&
        unitsInBrokenPack <= Number.MAX_SAFE_INTEGER,
      "unitsInBrokenPack",
    ),
      unitsInBrokenPack);
    return { feePerUnit: suppliedBreakFee / unitsInBrokenPack };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedBreakFee: 12, unitsInBrokenPack: 8 },
  output: { feePerUnit: 1.5 },
} satisfies ToolExample<Input, Output>;
export const supplierCasePackBreakFeePerUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["supply-chain", "supply chain", "business and finance"],
      keywords: ["supply chain", "business and finance"],
    },
    id: "supply-chain/supplier-case-pack-break-fee-per-unit",
    title: "Supplier Case Pack Break Fee Per Unit",
    description:
      "Allocate an explicit case-break fee over a supplied positive count of units without selecting supplier terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedBreakFee: { type: "number", minimum: 0 },
        unitsInBrokenPack: { type: "integer", minimum: 1 },
      },
      required: ["suppliedBreakFee", "unitsInBrokenPack"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { feePerUnit: { type: "number" } },
      required: ["feePerUnit"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedBreakFee",
          label: "Supplied Break Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitsInBrokenPack",
          label: "Units In Broken Pack",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "feePerUnit",
          label: "Fee Per Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = supplierCasePackBreakFeePerUnitTool.execute;
export default supplierCasePackBreakFeePerUnitTool;
