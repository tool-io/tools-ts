import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly error: number;
  readonly proportionalGain: number;
  readonly bias: number;
};
export type Output = { readonly output: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    error: { type: "number" },
    proportionalGain: { type: "number" },
    bias: { type: "number" },
  },
  required: ["error", "proportionalGain", "bias"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { output: { type: "number" } },
  required: ["output"],
} as const;
/** Apply one scalar proportional control law with explicitly supplied signed gain and bias; no actuator limit or controller tuning is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { error, proportionalGain, bias } = request;
  const compute = (): Output => {
    return { output: bias + proportionalGain * error };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { error: 2, proportionalGain: 3, bias: 1 },
  output: { output: 7 },
} satisfies ToolExample<Input, Output>;
export const proportionalControlStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cybernetics", "engineering"],
      keywords: ["cybernetics", "engineering"],
    },
    id: "cybernetics/proportional-control-step",
    title: "Proportional Control Step",
    description:
      "Apply one scalar proportional control law with explicitly supplied signed gain and bias; no actuator limit or controller tuning is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        error: { type: "number" },
        proportionalGain: { type: "number" },
        bias: { type: "number" },
      },
      required: ["error", "proportionalGain", "bias"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { output: { type: "number" } },
      required: ["output"],
    },
    ports: {
      inputs: [
        {
          id: "error",
          label: "Error",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "proportionalGain",
          label: "Proportional Gain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bias",
          label: "Bias",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "output", label: "Output", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = proportionalControlStepTool.execute;
export default proportionalControlStepTool;
