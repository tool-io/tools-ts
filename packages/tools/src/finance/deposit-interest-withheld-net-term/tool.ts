import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossInterest: number;
  readonly withholdingFraction: number;
};
export type Output = { readonly withheld: number; readonly net: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossInterest: { type: "number", minimum: 0 },
    withholdingFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grossInterest", "withholdingFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withheld: { type: "number" }, net: { type: "number" } },
  required: ["withheld", "net"],
} as const;
/** Split nonnegative deposit interest with a caller-supplied withholding fraction; no tax rule is inferred. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { grossInterest, withholdingFraction } = input;
  const compute = (): Output => {
    H.domain(grossInterest >= 0);
    H.probability(withholdingFraction);
    const withheld = grossInterest * withholdingFraction;
    return { withheld, net: grossInterest - withheld };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { grossInterest: 80, withholdingFraction: 0.25 },
  output: { withheld: 20, net: 60 },
} satisfies ToolExample<Input, Output>;
export const depositInterestWithheldNetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/deposit-interest-withheld-net-term",
    title: "Deposit Interest Withheld Net Term Tool",
    description:
      "Split nonnegative deposit interest with a caller-supplied withholding fraction; no tax rule is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossInterest: { type: "number", minimum: 0 },
        withholdingFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grossInterest", "withholdingFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withheld: { type: "number" }, net: { type: "number" } },
      required: ["withheld", "net"],
    },
    ports: {
      inputs: [
        {
          id: "grossInterest",
          label: "Gross Interest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withholdingFraction",
          label: "Withholding Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "withheld", label: "Withheld", valueType: { type: "number" } },
        { id: "net", label: "Net", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = depositInterestWithheldNetTermTool.execute;
export default depositInterestWithheldNetTermTool;
