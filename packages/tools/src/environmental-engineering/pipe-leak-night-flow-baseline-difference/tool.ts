import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineNightFlow: number;
  readonly measuredNightFlow: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineNightFlow: { type: "number" },
    measuredNightFlow: { type: "number" },
  },
  required: ["baselineNightFlow", "measuredNightFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit baseline from measured night flow on a shared time and unit basis without identifying leakage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineNightFlow, measuredNightFlow } = request;
  const compute = (): Output => {
    return { signedGap: measuredNightFlow - baselineNightFlow };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baselineNightFlow: 12, measuredNightFlow: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const pipeLeakNightFlowBaselineDifferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/pipe-leak-night-flow-baseline-difference",
      title: "Pipe Leak Night Flow Baseline Difference Tool",
      description:
        "Subtract explicit baseline from measured night flow on a shared time and unit basis without identifying leakage.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baselineNightFlow: { type: "number" },
          measuredNightFlow: { type: "number" },
        },
        required: ["baselineNightFlow", "measuredNightFlow"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "baselineNightFlow",
            label: "Baseline Night Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredNightFlow",
            label: "Measured Night Flow",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pipeLeakNightFlowBaselineDifferenceTool.execute;
export default pipeLeakNightFlowBaselineDifferenceTool;
