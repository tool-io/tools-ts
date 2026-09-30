import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftX: number;
  readonly rightX: number;
  readonly leftY: number;
  readonly rightY: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftX: { type: "number" },
    rightX: { type: "number" },
    leftY: { type: "number" },
    rightY: { type: "number" },
  },
  required: ["leftX", "rightX", "leftY", "rightY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate linear interpolant inverse sensitivity from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { leftX, rightX, leftY, rightY } = input;
  const compute = (): Output => {
    H.domain(leftX < rightX && leftY !== rightY);
    return { derivative: (rightX - leftX) / (rightY - leftY) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftX: 0, rightX: 4, leftY: 2, rightY: 10 },
  output: { derivative: 0.5 },
} satisfies ToolExample<Input, Output>;
export const linearInterpolantInverseSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/linear-interpolant-inverse-sensitivity",
      title: "Linear Interpolant Inverse Sensitivity Tool",
      description:
        "Calculate linear interpolant inverse sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leftX: { type: "number" },
          rightX: { type: "number" },
          leftY: { type: "number" },
          rightY: { type: "number" },
        },
        required: ["leftX", "rightX", "leftY", "rightY"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
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
            id: "rightY",
            label: "Right Y",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = linearInterpolantInverseSensitivityTool.execute;
export default linearInterpolantInverseSensitivityTool;
