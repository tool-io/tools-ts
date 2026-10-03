import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalPressure: number;
  readonly waterVaporPressure: number;
};
export type Output = {
  readonly dryPressure: number;
  readonly dryFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPressure: { type: "number", exclusiveMinimum: 0 },
    waterVaporPressure: { type: "number", minimum: 0 },
  },
  required: ["totalPressure", "waterVaporPressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryPressure: { type: "number" },
    dryFraction: { type: "number" },
  },
  required: ["dryPressure", "dryFraction"],
} as const;
/** Remove explicitly supplied water-vapor pressure from total pressure without a vapor-pressure table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalPressure, waterVaporPressure } = request;
  const compute = (): Output => {
    H.positive(totalPressure);
    H.domain(waterVaporPressure >= 0 && waterVaporPressure <= totalPressure);
    return {
      dryPressure: totalPressure - waterVaporPressure,
      dryFraction: (totalPressure - waterVaporPressure) / totalPressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalPressure: 100, waterVaporPressure: 5 },
  output: { dryPressure: 95, dryFraction: 0.95 },
} satisfies ToolExample<Input, Output>;
export const gasReferenceHumidityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/gas-reference-humidity-factor",
    title: "Gas Reference Humidity Factor Tool",
    description:
      "Remove explicitly supplied water-vapor pressure from total pressure without a vapor-pressure table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalPressure: { type: "number", exclusiveMinimum: 0 },
        waterVaporPressure: { type: "number", minimum: 0 },
      },
      required: ["totalPressure", "waterVaporPressure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryPressure: { type: "number" },
        dryFraction: { type: "number" },
      },
      required: ["dryPressure", "dryFraction"],
    },
    ports: {
      inputs: [
        {
          id: "totalPressure",
          label: "Total Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterVaporPressure",
          label: "Water Vapor Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryPressure",
          label: "Dry Pressure",
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gasReferenceHumidityFactorTool.execute;
export default gasReferenceHumidityFactorTool;
