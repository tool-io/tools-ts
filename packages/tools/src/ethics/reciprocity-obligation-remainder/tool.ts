import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedOwedAmount: number;
  readonly recordedReturnAmount: number;
};
export type Output = { readonly remainingAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedOwedAmount: { type: "number", minimum: 0 },
    recordedReturnAmount: { type: "number", minimum: 0 },
  },
  required: ["suppliedOwedAmount", "recordedReturnAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingAmount: { type: "number" } },
  required: ["remainingAmount"],
} as const;
/** Subtract explicit recorded returns from a caller-defined compatible owed amount without assigning ethical obligation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedOwedAmount, recordedReturnAmount } = request;
  const compute = (): Output => {
    H.domain(
      suppliedOwedAmount >= 0 && recordedReturnAmount >= 0,
      "suppliedOwedAmount",
    );
    return { remainingAmount: suppliedOwedAmount - recordedReturnAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedOwedAmount: 12, recordedReturnAmount: 8 },
  output: { remainingAmount: 4 },
} satisfies ToolExample<Input, Output>;
export const reciprocityObligationRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethics", "philosophy"],
      keywords: ["ethics", "philosophy"],
    },
    id: "ethics/reciprocity-obligation-remainder",
    title: "Reciprocity Obligation Remainder",
    description:
      "Subtract explicit recorded returns from a caller-defined compatible owed amount without assigning ethical obligation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedOwedAmount: { type: "number", minimum: 0 },
        recordedReturnAmount: { type: "number", minimum: 0 },
      },
      required: ["suppliedOwedAmount", "recordedReturnAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingAmount: { type: "number" } },
      required: ["remainingAmount"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedOwedAmount",
          label: "Supplied Owed Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedReturnAmount",
          label: "Recorded Return Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingAmount",
          label: "Remaining Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reciprocityObligationRemainderTool.execute;
export default reciprocityObligationRemainderTool;
