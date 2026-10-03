import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly correlation: number };
export type Output = { readonly squared: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correlation: { type: "number" } },
  required: ["correlation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { squared: { type: "number" }, sign: { type: "integer" } },
  required: ["squared", "sign"],
} as const;
/** Compute correlation squared sign loss label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { correlation } = input;
  const compute = (): Output => {
    domain(correlation >= -1 && correlation <= 1);
    return { squared: correlation * correlation, sign: Math.sign(correlation) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { correlation: -0.5 },
  output: { squared: 0.25, sign: -1 },
} satisfies ToolExample<Input, Output>;
export const correlationSquaredSignLossLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/correlation-squared-sign-loss-label",
  title: "Correlation Squared Sign Loss Label Tool",
  description:
    "Compute correlation squared sign loss label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "correlation",
        label: "Correlation",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "squared", label: "Squared", valueType: { type: "number" } },
      { id: "sign", label: "Sign", valueType: { type: "integer" } },
    ],
  },
});
export const run = correlationSquaredSignLossLabelTool.execute;
export default correlationSquaredSignLossLabelTool;
