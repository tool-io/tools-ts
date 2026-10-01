import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimulusWidth: number;
  readonly viewingDistance: number;
};
export type Output = {
  readonly angleRadians: number;
  readonly angleDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulusWidth: { type: "number", minimum: 0 },
    viewingDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["stimulusWidth", "viewingDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleRadians: { type: "number" },
    angleDegrees: { type: "number" },
  },
  required: ["angleRadians", "angleDegrees"],
} as const;
/** Return the exact centered planar stimulus angular width from supplied compatible dimensions, without an acuity score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stimulusWidth, viewingDistance } = request;
  const compute = (): Output => {
    H.domain(stimulusWidth >= 0);
    H.positive(viewingDistance);
    return {
      angleRadians: 2 * Math.atan(stimulusWidth / (2 * viewingDistance)),
      angleDegrees:
        (2 * Math.atan(stimulusWidth / (2 * viewingDistance)) * 180) / Math.PI,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stimulusWidth: 2, viewingDistance: 1 },
  output: { angleRadians: 1.5707963267948966, angleDegrees: 90 },
} satisfies ToolExample<Input, Output>;
export const visualAngleStimulusSizeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/visual-angle-stimulus-size",
    title: "Visual Angle Stimulus Size Tool",
    description:
      "Return the exact centered planar stimulus angular width from supplied compatible dimensions, without an acuity score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimulusWidth: { type: "number", minimum: 0 },
        viewingDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["stimulusWidth", "viewingDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleRadians: { type: "number" },
        angleDegrees: { type: "number" },
      },
      required: ["angleRadians", "angleDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "stimulusWidth",
          label: "Stimulus Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "viewingDistance",
          label: "Viewing Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "angleRadians",
          label: "Angle Radians",
          valueType: { type: "number" },
        },
        {
          id: "angleDegrees",
          label: "Angle Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = visualAngleStimulusSizeTool.execute;
export default visualAngleStimulusSizeTool;
