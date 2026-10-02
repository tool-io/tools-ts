import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly left: number; readonly right: number };
export type Output = { readonly logSum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { left: { type: "number" }, right: { type: "number" } },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logSum: { type: "number" } },
  required: ["logSum"],
} as const;
/** Compute log probability logsum two weights from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    const max = Math.max(left, right);
    return {
      logSum: max + Math.log(Math.exp(left - max) + Math.exp(right - max)),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 1000, right: 1000 },
  output: { logSum: 1000.6931471805599 },
} satisfies ToolExample<Input, Output>;
export const logProbabilityLogsumTwoWeightsTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "probability/log-probability-logsum-two-weights",
  title: "Log Probability Logsum Two Weights Tool",
  description:
    "Compute log probability logsum two weights from explicit bounded inputs.",
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
    outputs: [
      { id: "logSum", label: "Log Sum", valueType: { type: "number" } },
    ],
  },
});
export const run = logProbabilityLogsumTwoWeightsTool.execute;
export default logProbabilityLogsumTwoWeightsTool;
