import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftX: number;
  readonly knotX: number;
  readonly rightX: number;
  readonly leftY: number;
  readonly knotY: number;
  readonly rightY: number;
};
export type Output = { readonly slopeJump: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftX: { type: "number" },
    knotX: { type: "number" },
    rightX: { type: "number" },
    leftY: { type: "number" },
    knotY: { type: "number" },
    rightY: { type: "number" },
  },
  required: ["leftX", "knotX", "rightX", "leftY", "knotY", "rightY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slopeJump: { type: "number" } },
  required: ["slopeJump"],
} as const;
/** Calculate piecewise linear one knot curvature from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { leftX, knotX, rightX, leftY, knotY, rightY } = input;
  const compute = (): Output => {
    H.domain(leftX < knotX && knotX < rightX);
    return {
      slopeJump:
        (rightY - knotY) / (rightX - knotX) - (knotY - leftY) / (knotX - leftX),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftX: 0, knotX: 1, rightX: 3, leftY: 0, knotY: 2, rightY: 4 },
  output: { slopeJump: -1 },
} satisfies ToolExample<Input, Output>;
export const piecewiseLinearOneKnotCurvatureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/piecewise-linear-one-knot-curvature",
    title: "Piecewise Linear One Knot Curvature Tool",
    description:
      "Calculate piecewise linear one knot curvature from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftX: { type: "number" },
        knotX: { type: "number" },
        rightX: { type: "number" },
        leftY: { type: "number" },
        knotY: { type: "number" },
        rightY: { type: "number" },
      },
      required: ["leftX", "knotX", "rightX", "leftY", "knotY", "rightY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slopeJump: { type: "number" } },
      required: ["slopeJump"],
    },
    ports: {
      inputs: [
        {
          id: "leftX",
          label: "Left X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "knotX",
          label: "Knot X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightX",
          label: "Right X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftY",
          label: "Left Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "knotY",
          label: "Knot Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightY",
          label: "Right Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slopeJump", label: "Slope Jump", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = piecewiseLinearOneKnotCurvatureTool.execute;
export default piecewiseLinearOneKnotCurvatureTool;
