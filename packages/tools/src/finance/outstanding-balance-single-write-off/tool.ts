import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outstandingBalance: number;
  readonly writeoffAmount: number;
};
export type Output = { readonly remainingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outstandingBalance: { type: "number", minimum: 0 },
    writeoffAmount: { type: "number", minimum: 0 },
  },
  required: ["outstandingBalance", "writeoffAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingBalance: { type: "number" } },
  required: ["remainingBalance"],
} as const;
/** Subtract an explicit write-off amount from outstanding balance, preserving an excess write-off discrepancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outstandingBalance, writeoffAmount } = request;
  const compute = (): Output => {
    H.domain(
      outstandingBalance >= 0 && writeoffAmount >= 0,
      "outstandingBalance",
    );
    return { remainingBalance: outstandingBalance - writeoffAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outstandingBalance: 500, writeoffAmount: 75 },
  output: { remainingBalance: 425 },
} satisfies ToolExample<Input, Output>;
export const outstandingBalanceSingleWriteoffTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["finance", "business and finance"],
      keywords: ["finance", "business and finance"],
    },
    id: "finance/outstanding-balance-single-write-off",
    title: "Outstanding Balance Single Write Off",
    description:
      "Subtract an explicit write-off amount from outstanding balance, preserving an excess write-off discrepancy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outstandingBalance: { type: "number", minimum: 0 },
        writeoffAmount: { type: "number", minimum: 0 },
      },
      required: ["outstandingBalance", "writeoffAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingBalance: { type: "number" } },
      required: ["remainingBalance"],
    },
    ports: {
      inputs: [
        {
          id: "outstandingBalance",
          label: "Outstanding Balance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "writeoffAmount",
          label: "Writeoff Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingBalance",
          label: "Remaining Balance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = outstandingBalanceSingleWriteoffTool.execute;
export default outstandingBalanceSingleWriteoffTool;
