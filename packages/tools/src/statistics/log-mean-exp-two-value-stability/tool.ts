import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly left: number; readonly right: number };
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { left: { type: "number" }, right: { type: "number" } },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" } },
  required: ["value"],
} as const;
/** Compute log mean exp two value stability from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    const max = Math.max(left, right);
    return {
      value: max + Math.log((Math.exp(left - max) + Math.exp(right - max)) / 2),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 1000, right: 1000 },
  output: { value: 1000 },
} satisfies ToolExample<Input, Output>;
export const logMeanExpTwoValueStabilityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/log-mean-exp-two-value-stability",
  title: "Log Mean Exp Two Value Stability Tool",
  description:
    "Compute log mean exp two value stability from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [{ id: "value", label: "Value", valueType: { type: "number" } }],
  },
});
export const run = logMeanExpTwoValueStabilityTool.execute;
export default logMeanExpTwoValueStabilityTool;
