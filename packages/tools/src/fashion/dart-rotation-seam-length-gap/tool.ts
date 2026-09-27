import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRadius: number;
  readonly secondRadius: number;
  readonly angleRadians: number;
};
export type Output = {
  readonly firstArc: number;
  readonly secondArc: number;
  readonly lengthGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRadius: { type: "number", minimum: 0 },
    secondRadius: { type: "number", minimum: 0 },
    angleRadians: { type: "number", minimum: 0 },
  },
  required: ["firstRadius", "secondRadius", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstArc: { type: "number" },
    secondArc: { type: "number" },
    lengthGap: { type: "number" },
  },
  required: ["firstArc", "secondArc", "lengthGap"],
} as const;
/** Difference between two circular seam arcs under a supplied dart rotation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRadius, secondRadius, angleRadians } = request;
  const compute = (): Output => {
    H.domain(firstRadius >= 0 && secondRadius >= 0 && angleRadians >= 0);
    return {
      firstArc: firstRadius * angleRadians,
      secondArc: secondRadius * angleRadians,
      lengthGap: (secondRadius - firstRadius) * angleRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRadius: 10, secondRadius: 12, angleRadians: 0.2 },
  output: { firstArc: 2, secondArc: 2.4000000000000004, lengthGap: 0.4 },
} satisfies ToolExample<Input, Output>;
export const dartRotationSeamLengthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/dart-rotation-seam-length-gap",
    title: "Dart Rotation Seam Length Gap Tool",
    description:
      "Difference between two circular seam arcs under a supplied dart rotation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRadius: { type: "number", minimum: 0 },
        secondRadius: { type: "number", minimum: 0 },
        angleRadians: { type: "number", minimum: 0 },
      },
      required: ["firstRadius", "secondRadius", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstArc: { type: "number" },
        secondArc: { type: "number" },
        lengthGap: { type: "number" },
      },
      required: ["firstArc", "secondArc", "lengthGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstRadius",
          label: "First Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRadius",
          label: "Second Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        { id: "firstArc", label: "First Arc", valueType: { type: "number" } },
        { id: "secondArc", label: "Second Arc", valueType: { type: "number" } },
        { id: "lengthGap", label: "Length Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dartRotationSeamLengthGapTool.execute;
export default dartRotationSeamLengthGapTool;
