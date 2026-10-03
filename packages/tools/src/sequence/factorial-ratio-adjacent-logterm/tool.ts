import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly n: number };
export type Output = { readonly logRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { n: { type: "integer", minimum: 0 } },
  required: ["n"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logRatio: { type: "number" } },
  required: ["logRatio"],
} as const;
/** Calculate factorial ratio adjacent logterm from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { n } = request;
  const compute = (): Output => {
    H.integer(n, 0, Number.MAX_SAFE_INTEGER - 1);
    return { logRatio: Math.log(n + 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { n: 3 },
  output: { logRatio: 1.3862943611198906 },
} satisfies ToolExample<Input, Output>;
export const factorialRatioAdjacentLogtermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/factorial-ratio-adjacent-logterm",
    title: "Factorial Ratio Adjacent Logterm Tool",
    description:
      "Calculate factorial ratio adjacent logterm from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { n: { type: "integer", minimum: 0 } },
      required: ["n"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logRatio: { type: "number" } },
      required: ["logRatio"],
    },
    ports: {
      inputs: [
        { id: "n", label: "N", required: true, valueType: { type: "integer" } },
      ],
      outputs: [
        { id: "logRatio", label: "Log Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = factorialRatioAdjacentLogtermTool.execute;
export default factorialRatioAdjacentLogtermTool;
