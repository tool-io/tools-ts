import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly inputMass: number;
  readonly erasureProbability: number;
};
export type Output = {
  readonly retainedMass: number;
  readonly erasedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputMass: { type: "number", minimum: 0, maximum: 1 },
    erasureProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["inputMass", "erasureProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedMass: { type: "number" },
    erasedMass: { type: "number" },
  },
  required: ["retainedMass", "erasedMass"],
} as const;
/** Compute channel erasure output mass term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { inputMass, erasureProbability } = input;
  const compute = (): Output => {
    probability(inputMass);
    probability(erasureProbability);
    return {
      retainedMass: inputMass * (1 - erasureProbability),
      erasedMass: inputMass * erasureProbability,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { inputMass: 0.5, erasureProbability: 0.25 },
  output: { retainedMass: 0.375, erasedMass: 0.125 },
} satisfies ToolExample<Input, Output>;
export const channelErasureOutputMassTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "information/channel-erasure-output-mass-term",
  title: "Channel Erasure Output Mass Term Tool",
  description:
    "Compute channel erasure output mass term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "inputMass",
        label: "Input Mass",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "erasureProbability",
        label: "Erasure Probability",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "retainedMass",
        label: "Retained Mass",
        valueType: { type: "number" },
      },
      { id: "erasedMass", label: "Erased Mass", valueType: { type: "number" } },
    ],
  },
});
export const run = channelErasureOutputMassTermTool.execute;
export default channelErasureOutputMassTermTool;
