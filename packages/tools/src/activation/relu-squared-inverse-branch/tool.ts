import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly output: number };
export type Output = {
  readonly positiveInput: number;
  readonly zeroRay: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { output: { type: "number", minimum: 0 } },
  required: ["output"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveInput: { type: "number" },
    zeroRay: { type: "boolean" },
  },
  required: ["positiveInput", "zeroRay"],
} as const;
/** Invert squared ReLU, flagging the complete nonpositive input ray at zero output. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { output } = request;
  const compute = (): Output => {
    H.domain(output >= 0);
    return { positiveInput: Math.sqrt(output), zeroRay: output === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { output: 9 },
  output: { positiveInput: 3, zeroRay: false },
} satisfies ToolExample<Input, Output>;
export const reluSquaredInverseBranchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/relu-squared-inverse-branch",
    title: "ReLU Squared Inverse Branch Tool",
    description:
      "Invert squared ReLU, flagging the complete nonpositive input ray at zero output.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { output: { type: "number", minimum: 0 } },
      required: ["output"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveInput: { type: "number" },
        zeroRay: { type: "boolean" },
      },
      required: ["positiveInput", "zeroRay"],
    },
    ports: {
      inputs: [
        {
          id: "output",
          label: "Output",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "positiveInput",
          label: "Positive Input",
          valueType: { type: "number" },
        },
        { id: "zeroRay", label: "Zero Ray", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = reluSquaredInverseBranchTool.execute;
export default reluSquaredInverseBranchTool;
