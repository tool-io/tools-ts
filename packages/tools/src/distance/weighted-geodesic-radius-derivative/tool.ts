import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centralAngleRadians: number;
  readonly weight: number;
};
export type Output = { readonly radiusDerivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centralAngleRadians: { type: "number", minimum: 0 },
    weight: { type: "number", minimum: 0 },
  },
  required: ["centralAngleRadians", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radiusDerivative: { type: "number" } },
  required: ["radiusDerivative"],
} as const;
/** Radius derivative of weight times spherical arc distance at a fixed supplied central angle. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centralAngleRadians, weight } = request;
  const compute = (): Output => {
    H.domain(
      centralAngleRadians >= 0 && centralAngleRadians <= Math.PI && weight >= 0,
    );
    return { radiusDerivative: centralAngleRadians * weight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centralAngleRadians: 0.5, weight: 2 },
  output: { radiusDerivative: 1 },
} satisfies ToolExample<Input, Output>;
export const weightedGeodesicRadiusDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/weighted-geodesic-radius-derivative",
    title: "Weighted Geodesic Radius Derivative Tool",
    description:
      "Radius derivative of weight times spherical arc distance at a fixed supplied central angle.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centralAngleRadians: { type: "number", minimum: 0 },
        weight: { type: "number", minimum: 0 },
      },
      required: ["centralAngleRadians", "weight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radiusDerivative: { type: "number" } },
      required: ["radiusDerivative"],
    },
    ports: {
      inputs: [
        {
          id: "centralAngleRadians",
          label: "Central Angle Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "radiusDerivative",
          label: "Radius Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = weightedGeodesicRadiusDerivativeTool.execute;
export default weightedGeodesicRadiusDerivativeTool;
