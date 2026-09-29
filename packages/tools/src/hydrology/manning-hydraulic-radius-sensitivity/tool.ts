import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly velocity: number;
  readonly hydraulicRadius: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    velocity: { type: "number", minimum: 0 },
    hydraulicRadius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["velocity", "hydraulicRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Differentiate Manning velocity with respect to hydraulic radius while holding roughness and energy slope fixed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { velocity, hydraulicRadius } = request;
  const compute = (): Output => {
    H.domain(velocity >= 0);
    H.positive(hydraulicRadius);
    return { derivative: (2 * velocity) / (3 * hydraulicRadius) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { velocity: 3, hydraulicRadius: 2 },
  output: { derivative: 1 },
} satisfies ToolExample<Input, Output>;
export const manningHydraulicRadiusSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/manning-hydraulic-radius-sensitivity",
    title: "Manning Hydraulic Radius Sensitivity Tool",
    description:
      "Differentiate Manning velocity with respect to hydraulic radius while holding roughness and energy slope fixed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        velocity: { type: "number", minimum: 0 },
        hydraulicRadius: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["velocity", "hydraulicRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
    },
    ports: {
      inputs: [
        {
          id: "velocity",
          label: "Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hydraulicRadius",
          label: "Hydraulic Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = manningHydraulicRadiusSensitivityTool.execute;
export default manningHydraulicRadiusSensitivityTool;
