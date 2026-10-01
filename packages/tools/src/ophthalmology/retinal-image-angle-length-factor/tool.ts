import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angleRadians: number;
  readonly eyeScaleLength: number;
  readonly exactTangent: boolean;
};
export type Output = {
  readonly retinalLength: number;
  readonly smallAngleLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleRadians: { type: "number" },
    eyeScaleLength: { type: "number", exclusiveMinimum: 0 },
    exactTangent: { type: "boolean" },
  },
  required: ["angleRadians", "eyeScaleLength", "exactTangent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retinalLength: { type: "number" },
    smallAngleLength: { type: "number" },
  },
  required: ["retinalLength", "smallAngleLength"],
} as const;
/** Supplied reduced-eye planar scale times angle or tangent, without an individual eye biometry or retinal magnification model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angleRadians, eyeScaleLength, exactTangent } = request;
  const compute = (): Output => {
    H.positive(eyeScaleLength);
    H.domain(angleRadians > -Math.PI / 2 && angleRadians < Math.PI / 2);
    return {
      retinalLength:
        eyeScaleLength * (exactTangent ? Math.tan(angleRadians) : angleRadians),
      smallAngleLength: eyeScaleLength * angleRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angleRadians: 0.1, eyeScaleLength: 17, exactTangent: false },
  output: {
    retinalLength: 1.7000000000000002,
    smallAngleLength: 1.7000000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const retinalImageAngleLengthFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/retinal-image-angle-length-factor",
    title: "Retinal Image Angle Length Factor Tool",
    description:
      "Supplied reduced-eye planar scale times angle or tangent, without an individual eye biometry or retinal magnification model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleRadians: { type: "number" },
        eyeScaleLength: { type: "number", exclusiveMinimum: 0 },
        exactTangent: { type: "boolean" },
      },
      required: ["angleRadians", "eyeScaleLength", "exactTangent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retinalLength: { type: "number" },
        smallAngleLength: { type: "number" },
      },
      required: ["retinalLength", "smallAngleLength"],
    },
    ports: {
      inputs: [
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "eyeScaleLength",
          label: "Eye Scale Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exactTangent",
          label: "Exact Tangent",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "retinalLength",
          label: "Retinal Length",
          valueType: { type: "number" },
        },
        {
          id: "smallAngleLength",
          label: "Small Angle Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = retinalImageAngleLengthFactorTool.execute;
export default retinalImageAngleLengthFactorTool;
