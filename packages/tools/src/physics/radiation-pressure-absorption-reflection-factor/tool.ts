import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intensity: number;
  readonly absorption: number;
  readonly reflection: number;
  readonly lightSpeed: number;
};
export type Output = { readonly pressure: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intensity: { type: "number", minimum: 0 },
    absorption: { type: "number", minimum: 0, maximum: 1 },
    reflection: { type: "number", minimum: 0, maximum: 1 },
    lightSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["intensity", "absorption", "reflection", "lightSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pressure: { type: "number" } },
  required: ["pressure"],
} as const;
/** Use normal incidence in vacuum with forward transmission and explicitly supplied absorption/reflection fractions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intensity, absorption, reflection, lightSpeed } = request;
  const compute = (): Output => {
    H.domain(intensity >= 0);
    H.probability(absorption);
    H.probability(reflection);
    H.domain(absorption + reflection <= 1);
    H.positive(lightSpeed);
    return {
      pressure: (intensity * (absorption + 2 * reflection)) / lightSpeed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    intensity: 299792458,
    absorption: 0,
    reflection: 1,
    lightSpeed: 299792458,
  },
  output: { pressure: 2 },
} satisfies ToolExample<Input, Output>;
export const radiationPressureAbsorptionReflectionFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physics/radiation-pressure-absorption-reflection-factor",
      title: "Radiation Pressure Absorption Reflection Factor Tool",
      description:
        "Use normal incidence in vacuum with forward transmission and explicitly supplied absorption/reflection fractions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intensity: { type: "number", minimum: 0 },
          absorption: { type: "number", minimum: 0, maximum: 1 },
          reflection: { type: "number", minimum: 0, maximum: 1 },
          lightSpeed: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["intensity", "absorption", "reflection", "lightSpeed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { pressure: { type: "number" } },
        required: ["pressure"],
      },
      ports: {
        inputs: [
          {
            id: "intensity",
            label: "Intensity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "absorption",
            label: "Absorption",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reflection",
            label: "Reflection",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lightSpeed",
            label: "Light Speed",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "pressure", label: "Pressure", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = radiationPressureAbsorptionReflectionFactorTool.execute;
export default radiationPressureAbsorptionReflectionFactorTool;
