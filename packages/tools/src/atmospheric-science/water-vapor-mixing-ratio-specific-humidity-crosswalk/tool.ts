import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly mixingRatioKgPerKg: number };
export type Output = { readonly specificHumidityKgPerKg: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mixingRatioKgPerKg: { type: "number", minimum: 0 } },
  required: ["mixingRatioKgPerKg"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { specificHumidityKgPerKg: { type: "number" } },
  required: ["specificHumidityKgPerKg"],
} as const;
/** Convert water-vapor mass per dry-air mass to mass per total moist-air mass, q = r/(1+r). */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mixingRatioKgPerKg } = request;
  const compute = (): Output => {
    H.domain(mixingRatioKgPerKg >= 0, "mixingRatioKgPerKg");
    return {
      specificHumidityKgPerKg: mixingRatioKgPerKg / (1 + mixingRatioKgPerKg),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mixingRatioKgPerKg: 0.01 },
  output: { specificHumidityKgPerKg: 0.009900990099009901 },
} satisfies ToolExample<Input, Output>;
export const waterVaporMixingRatioSpecificHumidityCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/water-vapor-mixing-ratio-specific-humidity-crosswalk",
      title: "Water Vapor Mixing Ratio Specific Humidity Crosswalk Tool",
      description:
        "Convert water-vapor mass per dry-air mass to mass per total moist-air mass, q = r/(1+r).",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { mixingRatioKgPerKg: { type: "number", minimum: 0 } },
        required: ["mixingRatioKgPerKg"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { specificHumidityKgPerKg: { type: "number" } },
        required: ["specificHumidityKgPerKg"],
      },
      ports: {
        inputs: [
          {
            id: "mixingRatioKgPerKg",
            label: "Mixing Ratio Kg Per Kg",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "specificHumidityKgPerKg",
            label: "Specific Humidity Kg Per Kg",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = waterVaporMixingRatioSpecificHumidityCrosswalkTool.execute;
export default waterVaporMixingRatioSpecificHumidityCrosswalkTool;
