import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly horizontalOffset: number;
  readonly grade: number;
  readonly referenceElevation: number;
};
export type Output = {
  readonly elevationChange: number;
  readonly shiftedElevation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalOffset: { type: "number" },
    grade: { type: "number" },
    referenceElevation: { type: "number" },
  },
  required: ["horizontalOffset", "grade", "referenceElevation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elevationChange: { type: "number" },
    shiftedElevation: { type: "number" },
  },
  required: ["elevationChange", "shiftedElevation"],
} as const;
/** Signed elevation offset under an explicitly supplied local grade. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { horizontalOffset, grade, referenceElevation } = request;
  const compute = (): Output => {
    return {
      elevationChange: horizontalOffset * grade,
      shiftedElevation: referenceElevation + horizontalOffset * grade,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { horizontalOffset: 10, grade: 0.05, referenceElevation: 100 },
  output: { elevationChange: 0.5, shiftedElevation: 100.5 },
} satisfies ToolExample<Input, Output>;
export const gardenContourOffsetGradientTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/garden-contour-offset-gradient-term",
    title: "Garden Contour Offset Gradient Term Tool",
    description:
      "Signed elevation offset under an explicitly supplied local grade.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalOffset: { type: "number" },
        grade: { type: "number" },
        referenceElevation: { type: "number" },
      },
      required: ["horizontalOffset", "grade", "referenceElevation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elevationChange: { type: "number" },
        shiftedElevation: { type: "number" },
      },
      required: ["elevationChange", "shiftedElevation"],
    },
    ports: {
      inputs: [
        {
          id: "horizontalOffset",
          label: "Horizontal Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grade",
          label: "Grade",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceElevation",
          label: "Reference Elevation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elevationChange",
          label: "Elevation Change",
          valueType: { type: "number" },
        },
        {
          id: "shiftedElevation",
          label: "Shifted Elevation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gardenContourOffsetGradientTermTool.execute;
export default gardenContourOffsetGradientTermTool;
