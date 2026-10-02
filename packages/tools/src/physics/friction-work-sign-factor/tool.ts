import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forceMagnitude: number;
  readonly displacementMagnitude: number;
  readonly angleRadians: number;
};
export type Output = { readonly work: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forceMagnitude: { type: "number", minimum: 0 },
    displacementMagnitude: { type: "number", minimum: 0 },
    angleRadians: { type: "number" },
  },
  required: ["forceMagnitude", "displacementMagnitude", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { work: { type: "number" }, sign: { type: "integer" } },
  required: ["work", "sign"],
} as const;
/** Evaluate supplied force work F*s*cos(angle); a force or displacement of zero still has an explicitly supplied angular sign factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forceMagnitude, displacementMagnitude, angleRadians } = request;
  const compute = (): Output => {
    H.domain(forceMagnitude >= 0 && displacementMagnitude >= 0);
    return {
      work: forceMagnitude * displacementMagnitude * Math.cos(angleRadians),
      sign: Math.sign(Math.cos(angleRadians)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    forceMagnitude: 5,
    displacementMagnitude: 2,
    angleRadians: 3.141592653589793,
  },
  output: { work: -10, sign: -1 },
} satisfies ToolExample<Input, Output>;
export const frictionWorkSignFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/friction-work-sign-factor",
    title: "Friction Work Sign Factor Tool",
    description:
      "Evaluate supplied force work F*s*cos(angle); a force or displacement of zero still has an explicitly supplied angular sign factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forceMagnitude: { type: "number", minimum: 0 },
        displacementMagnitude: { type: "number", minimum: 0 },
        angleRadians: { type: "number" },
      },
      required: ["forceMagnitude", "displacementMagnitude", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { work: { type: "number" }, sign: { type: "integer" } },
      required: ["work", "sign"],
    },
    ports: {
      inputs: [
        {
          id: "forceMagnitude",
          label: "Force Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacementMagnitude",
          label: "Displacement Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "work", label: "Work", valueType: { type: "number" } },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = frictionWorkSignFactorTool.execute;
export default frictionWorkSignFactorTool;
