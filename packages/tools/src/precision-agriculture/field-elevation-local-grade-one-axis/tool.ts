import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstElevation: number;
  readonly secondElevation: number;
  readonly horizontalDistance: number;
};
export type Output = { readonly grade: number; readonly angleRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstElevation: { type: "number" },
    secondElevation: { type: "number" },
    horizontalDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstElevation", "secondElevation", "horizontalDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { grade: { type: "number" }, angleRadians: { type: "number" } },
  required: ["grade", "angleRadians"],
} as const;
/** Calculate field elevation local grade one axis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstElevation, secondElevation, horizontalDistance } = request;
  const compute = (): Output => {
    H.positive(horizontalDistance);
    return {
      grade: (secondElevation - firstElevation) / horizontalDistance,
      angleRadians: Math.atan2(
        secondElevation - firstElevation,
        horizontalDistance,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstElevation: 100, secondElevation: 102, horizontalDistance: 20 },
  output: { grade: 0.1, angleRadians: 0.09966865249116204 },
} satisfies ToolExample<Input, Output>;
export const fieldElevationLocalGradeOneAxisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/field-elevation-local-grade-one-axis",
    title: "Field Elevation Local Grade One Axis Tool",
    description:
      "Calculate field elevation local grade one axis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstElevation: { type: "number" },
        secondElevation: { type: "number" },
        horizontalDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstElevation", "secondElevation", "horizontalDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grade: { type: "number" },
        angleRadians: { type: "number" },
      },
      required: ["grade", "angleRadians"],
    },
    ports: {
      inputs: [
        {
          id: "firstElevation",
          label: "First Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondElevation",
          label: "Second Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalDistance",
          label: "Horizontal Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grade", label: "Grade", valueType: { type: "number" } },
        {
          id: "angleRadians",
          label: "Angle Radians",
          valueType: { type: "number", unit: "rad" },
        },
      ],
    },
  },
  calculate,
});
export const run = fieldElevationLocalGradeOneAxisTool.execute;
export default fieldElevationLocalGradeOneAxisTool;
