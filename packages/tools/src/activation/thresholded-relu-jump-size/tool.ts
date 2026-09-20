import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly threshold: number };
export type Output = {
  readonly leftLimit: number;
  readonly rightLimit: number;
  readonly jump: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { threshold: { type: "number", minimum: 0 } },
  required: ["threshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftLimit: { type: "number" },
    rightLimit: { type: "number" },
    jump: { type: "number" },
  },
  required: ["leftLimit", "rightLimit", "jump"],
} as const;
/** Return the one-sided discontinuity of x if x>threshold else zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { threshold } = request;
  const compute = (): Output => {
    H.domain(threshold >= 0);
    return { leftLimit: 0, rightLimit: threshold, jump: threshold };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { threshold: 2 },
  output: { leftLimit: 0, rightLimit: 2, jump: 2 },
} satisfies ToolExample<Input, Output>;
export const thresholdedReluJumpSizeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/thresholded-relu-jump-size",
    title: "Thresholded ReLU Jump Size Tool",
    description:
      "Return the one-sided discontinuity of x if x>threshold else zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { threshold: { type: "number", minimum: 0 } },
      required: ["threshold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftLimit: { type: "number" },
        rightLimit: { type: "number" },
        jump: { type: "number" },
      },
      required: ["leftLimit", "rightLimit", "jump"],
    },
    ports: {
      inputs: [
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "leftLimit", label: "Left Limit", valueType: { type: "number" } },
        {
          id: "rightLimit",
          label: "Right Limit",
          valueType: { type: "number" },
        },
        { id: "jump", label: "Jump", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = thresholdedReluJumpSizeTool.execute;
export default thresholdedReluJumpSizeTool;
