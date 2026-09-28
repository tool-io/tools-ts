import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly secondDerivative: number;
  readonly elevationPositiveUp: boolean;
};
export type Output = { readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secondDerivative: { type: "number" },
    elevationPositiveUp: { type: "boolean" },
  },
  required: ["secondDerivative", "elevationPositiveUp"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sign: { type: "integer" } },
  required: ["sign"],
} as const;
/** Classify an explicitly supplied profile second derivative under a declared vertical orientation, not a fitted terrain curvature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { secondDerivative, elevationPositiveUp } = request;
  const compute = (): Output => {
    return {
      sign: Math.sign(secondDerivative) * (elevationPositiveUp ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { secondDerivative: 0.2, elevationPositiveUp: true },
  output: { sign: 1 },
} satisfies ToolExample<Input, Output>;
export const profileCurvatureSignTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/profile-curvature-sign-term",
    title: "Profile Curvature Sign Term Tool",
    description:
      "Classify an explicitly supplied profile second derivative under a declared vertical orientation, not a fitted terrain curvature.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secondDerivative: { type: "number" },
        elevationPositiveUp: { type: "boolean" },
      },
      required: ["secondDerivative", "elevationPositiveUp"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sign: { type: "integer" } },
      required: ["sign"],
    },
    ports: {
      inputs: [
        {
          id: "secondDerivative",
          label: "Second Derivative",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elevationPositiveUp",
          label: "Elevation Positive Up",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "sign", label: "Sign", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = profileCurvatureSignTermTool.execute;
export default profileCurvatureSignTermTool;
