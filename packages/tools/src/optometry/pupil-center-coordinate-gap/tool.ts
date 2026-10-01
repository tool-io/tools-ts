import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstX: number;
  readonly firstY: number;
  readonly secondX: number;
  readonly secondY: number;
};
export type Output = {
  readonly dx: number;
  readonly dy: number;
  readonly distance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstX: { type: "number" },
    firstY: { type: "number" },
    secondX: { type: "number" },
    secondY: { type: "number" },
  },
  required: ["firstX", "firstY", "secondX", "secondY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dx: { type: "number" },
    dy: { type: "number" },
    distance: { type: "number" },
  },
  required: ["dx", "dy", "distance"],
} as const;
/** Calculate pupil center coordinate gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstX, firstY, secondX, secondY } = request;
  const compute = (): Output => {
    return {
      dx: secondX - firstX,
      dy: secondY - firstY,
      distance: Math.hypot(secondX - firstX, secondY - firstY),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstX: 1, firstY: 2, secondX: 4, secondY: 6 },
  output: { dx: 3, dy: 4, distance: 5 },
} satisfies ToolExample<Input, Output>;
export const pupilCenterCoordinateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/pupil-center-coordinate-gap",
    title: "Pupil Center Coordinate Gap Tool",
    description:
      "Calculate pupil center coordinate gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstX: { type: "number" },
        firstY: { type: "number" },
        secondX: { type: "number" },
        secondY: { type: "number" },
      },
      required: ["firstX", "firstY", "secondX", "secondY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dx: { type: "number" },
        dy: { type: "number" },
        distance: { type: "number" },
      },
      required: ["dx", "dy", "distance"],
    },
    ports: {
      inputs: [
        {
          id: "firstX",
          label: "First X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstY",
          label: "First Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondX",
          label: "Second X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondY",
          label: "Second Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dx", label: "Dx", valueType: { type: "number" } },
        { id: "dy", label: "Dy", valueType: { type: "number" } },
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pupilCenterCoordinateGapTool.execute;
export default pupilCenterCoordinateGapTool;
