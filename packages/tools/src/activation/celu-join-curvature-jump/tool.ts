import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly alpha: number };
export type Output = {
  readonly leftCurvature: number;
  readonly rightCurvature: number;
  readonly rightMinusLeft: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { alpha: { type: "number", exclusiveMinimum: 0 } },
  required: ["alpha"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftCurvature: { type: "number" },
    rightCurvature: { type: "number" },
    rightMinusLeft: { type: "number" },
  },
  required: ["leftCurvature", "rightCurvature", "rightMinusLeft"],
} as const;
/** Calculate celu join curvature jump from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alpha } = request;
  const compute = (): Output => {
    H.positive(alpha);
    return {
      leftCurvature: 1 / alpha,
      rightCurvature: 0,
      rightMinusLeft: -1 / alpha,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { alpha: 2 },
  output: { leftCurvature: 0.5, rightCurvature: 0, rightMinusLeft: -0.5 },
} satisfies ToolExample<Input, Output>;
export const celuJoinCurvatureJumpTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/celu-join-curvature-jump",
    title: "CELU Join Curvature Jump Tool",
    description:
      "Calculate celu join curvature jump from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { alpha: { type: "number", exclusiveMinimum: 0 } },
      required: ["alpha"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftCurvature: { type: "number" },
        rightCurvature: { type: "number" },
        rightMinusLeft: { type: "number" },
      },
      required: ["leftCurvature", "rightCurvature", "rightMinusLeft"],
    },
    ports: {
      inputs: [
        {
          id: "alpha",
          label: "Alpha",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leftCurvature",
          label: "Left Curvature",
          valueType: { type: "number" },
        },
        {
          id: "rightCurvature",
          label: "Right Curvature",
          valueType: { type: "number" },
        },
        {
          id: "rightMinusLeft",
          label: "Right Minus Left",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = celuJoinCurvatureJumpTool.execute;
export default celuJoinCurvatureJumpTool;
