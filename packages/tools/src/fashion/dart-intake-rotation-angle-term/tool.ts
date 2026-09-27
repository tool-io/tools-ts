import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly intake: number; readonly radius: number };
export type Output = { readonly angleRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intake: { type: "number", minimum: 0 },
    radius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["intake", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angleRadians: { type: "number" } },
  required: ["angleRadians"],
} as const;
/** Treat dart intake as a chord at a supplied apex radius. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intake, radius } = request;
  const compute = (): Output => {
    H.positive(radius);
    H.domain(intake >= 0 && intake <= 2 * radius);
    return { angleRadians: 2 * Math.asin(intake / (2 * radius)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intake: 2, radius: 2 },
  output: { angleRadians: 1.0471975511965979 },
} satisfies ToolExample<Input, Output>;
export const dartIntakeRotationAngleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/dart-intake-rotation-angle-term",
    title: "Dart Intake Rotation Angle Term Tool",
    description: "Treat dart intake as a chord at a supplied apex radius.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intake: { type: "number", minimum: 0 },
        radius: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["intake", "radius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angleRadians: { type: "number" } },
      required: ["angleRadians"],
    },
    ports: {
      inputs: [
        {
          id: "intake",
          label: "Intake",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "radius",
          label: "Radius",
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
      ],
    },
  },
  calculate,
});
export const run = dartIntakeRotationAngleTermTool.execute;
export default dartIntakeRotationAngleTermTool;
