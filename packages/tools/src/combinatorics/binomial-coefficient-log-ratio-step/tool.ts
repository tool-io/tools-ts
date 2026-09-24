import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly n: number; readonly k: number };
export type Output = { readonly ratio: number; readonly logRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: { type: "integer", minimum: 1, maximum: 1000000 },
    k: { type: "integer", minimum: 0 },
  },
  required: ["n", "k"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, logRatio: { type: "number" } },
  required: ["ratio", "logRatio"],
} as const;
/** Compute binomial coefficient log ratio step from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { n, k } = input;
  const compute = (): Output => {
    integer(n, 1, 1000000);
    integer(k, 0, n - 1);
    const ratio = (n - k) / (k + 1);
    return { ratio, logRatio: Math.log(ratio) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { n: 5, k: 2 },
  output: { ratio: 1, logRatio: 0 },
} satisfies ToolExample<Input, Output>;
export const binomialCoefficientLogRatioStepTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/binomial-coefficient-log-ratio-step",
  title: "Binomial Coefficient Log Ratio Step Tool",
  description:
    "Compute binomial coefficient log ratio step from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "n", label: "N", required: true, valueType: { type: "integer" } },
      { id: "k", label: "K", required: true, valueType: { type: "integer" } },
    ],
    outputs: [
      { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      { id: "logRatio", label: "Log Ratio", valueType: { type: "number" } },
    ],
  },
});
export const run = binomialCoefficientLogRatioStepTool.execute;
export default binomialCoefficientLogRatioStepTool;
