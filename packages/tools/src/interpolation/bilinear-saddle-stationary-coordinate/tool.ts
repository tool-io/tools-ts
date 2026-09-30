import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly linearX: number;
  readonly linearY: number;
  readonly cross: number;
};
export type Output = {
  readonly x: number;
  readonly y: number;
  readonly insideUnitCell: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearX: { type: "number" },
    linearY: { type: "number" },
    cross: { type: "number" },
  },
  required: ["linearX", "linearY", "cross"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    insideUnitCell: { type: "boolean" },
  },
  required: ["x", "y", "insideUnitCell"],
} as const;
/** Calculate bilinear saddle stationary coordinate from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { linearX, linearY, cross } = input;
  const compute = (): Output => {
    H.domain(cross !== 0);
    const x = -linearY / cross,
      y = -linearX / cross;
    return { x, y, insideUnitCell: x >= 0 && x <= 1 && y >= 0 && y <= 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { linearX: -2, linearY: -1, cross: 4 },
  output: { x: 0.25, y: 0.5, insideUnitCell: true },
} satisfies ToolExample<Input, Output>;
export const bilinearSaddleStationaryCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/bilinear-saddle-stationary-coordinate",
    title: "Bilinear Saddle Stationary Coordinate Tool",
    description:
      "Calculate bilinear saddle stationary coordinate from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearX: { type: "number" },
        linearY: { type: "number" },
        cross: { type: "number" },
      },
      required: ["linearX", "linearY", "cross"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        y: { type: "number" },
        insideUnitCell: { type: "boolean" },
      },
      required: ["x", "y", "insideUnitCell"],
    },
    ports: {
      inputs: [
        {
          id: "linearX",
          label: "Linear X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "linearY",
          label: "Linear Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cross",
          label: "Cross",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "x", label: "X", valueType: { type: "number" } },
        { id: "y", label: "Y", valueType: { type: "number" } },
        {
          id: "insideUnitCell",
          label: "Inside Unit Cell",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = bilinearSaddleStationaryCoordinateTool.execute;
export default bilinearSaddleStationaryCoordinateTool;
