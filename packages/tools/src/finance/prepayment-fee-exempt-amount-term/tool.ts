import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prepayment: number;
  readonly exemption: number;
  readonly rate: number;
};
export type Output = { readonly chargeable: number; readonly fee: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prepayment: { type: "number", minimum: 0 },
    exemption: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0 },
  },
  required: ["prepayment", "exemption", "rate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { chargeable: { type: "number" }, fee: { type: "number" } },
  required: ["chargeable", "fee"],
} as const;
/** Apply a supplied fee fraction only to prepayment above an explicit exemption. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { prepayment, exemption, rate } = input;
  const compute = (): Output => {
    H.domain(prepayment >= 0 && exemption >= 0 && rate >= 0);
    const chargeable = Math.max(0, prepayment - exemption);
    return { chargeable, fee: chargeable * rate };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { prepayment: 1200, exemption: 1000, rate: 0.02 },
  output: { chargeable: 200, fee: 4 },
} satisfies ToolExample<Input, Output>;
export const prepaymentFeeExemptAmountTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/prepayment-fee-exempt-amount-term",
    title: "Prepayment Fee Exempt Amount Term Tool",
    description:
      "Apply a supplied fee fraction only to prepayment above an explicit exemption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prepayment: { type: "number", minimum: 0 },
        exemption: { type: "number", minimum: 0 },
        rate: { type: "number", minimum: 0 },
      },
      required: ["prepayment", "exemption", "rate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { chargeable: { type: "number" }, fee: { type: "number" } },
      required: ["chargeable", "fee"],
    },
    ports: {
      inputs: [
        {
          id: "prepayment",
          label: "Prepayment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exemption",
          label: "Exemption",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "chargeable",
          label: "Chargeable",
          valueType: { type: "number" },
        },
        { id: "fee", label: "Fee", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = prepaymentFeeExemptAmountTermTool.execute;
export default prepaymentFeeExemptAmountTermTool;
