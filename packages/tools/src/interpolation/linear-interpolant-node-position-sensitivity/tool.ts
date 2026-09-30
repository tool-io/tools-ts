import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly x: number;
  readonly x0: number;
  readonly x1: number;
  readonly y0: number;
  readonly y1: number;
};
export type Output = {
  readonly leftSensitivity: number;
  readonly rightSensitivity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    x0: { type: "number" },
    x1: { type: "number" },
    y0: { type: "number" },
    y1: { type: "number" },
  },
  required: ["x", "x0", "x1", "y0", "y1"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftSensitivity: { type: "number" },
    rightSensitivity: { type: "number" },
  },
  required: ["leftSensitivity", "rightSensitivity"],
} as const;
/** Compute linear interpolant node position sensitivity from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { x, x0, x1, y0, y1 } = input;
  const compute = (): Output => {
    domain(x0 !== x1);
    const d = x1 - x0,
      s = (y1 - y0) / (d * d);
    return { leftSensitivity: (x - x1) * s, rightSensitivity: -(x - x0) * s };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 1, x0: 0, x1: 2, y0: 0, y1: 4 },
  output: { leftSensitivity: -1, rightSensitivity: -1 },
} satisfies ToolExample<Input, Output>;
export const linearInterpolantNodePositionSensitivityTool =
  defineSchemaCalculation<Input, Output>({
    id: "interpolation/linear-interpolant-node-position-sensitivity",
    title: "Linear Interpolant Node Position Sensitivity Tool",
    description:
      "Compute linear interpolant node position sensitivity from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "x0",
          label: "X0",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "x1",
          label: "X1",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "y0",
          label: "Y0",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "y1",
          label: "Y1",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leftSensitivity",
          label: "Left Sensitivity",
          valueType: { type: "number" },
        },
        {
          id: "rightSensitivity",
          label: "Right Sensitivity",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = linearInterpolantNodePositionSensitivityTool.execute;
export default linearInterpolantNodePositionSensitivityTool;
