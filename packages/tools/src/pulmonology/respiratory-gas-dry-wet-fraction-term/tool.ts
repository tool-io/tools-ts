import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetFraction: number;
  readonly waterVaporFraction: number;
  readonly totalPressure: number;
};
export type Output = {
  readonly dryFraction: number;
  readonly wetPartialPressure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetFraction: { type: "number", minimum: 0 },
    waterVaporFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    totalPressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wetFraction", "waterVaporFraction", "totalPressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryFraction: { type: "number" },
    wetPartialPressure: { type: "number" },
  },
  required: ["dryFraction", "wetPartialPressure"],
} as const;
/** Wet-to-dry gas fraction with an explicit water-vapor fraction, without blood-gas conversion or gas-administration guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetFraction, waterVaporFraction, totalPressure } = request;
  const compute = (): Output => {
    H.domain(
      waterVaporFraction >= 0 &&
        waterVaporFraction < 1 &&
        wetFraction >= 0 &&
        wetFraction <= 1 - waterVaporFraction,
    );
    H.positive(totalPressure);
    return {
      dryFraction: wetFraction / (1 - waterVaporFraction),
      wetPartialPressure: wetFraction * totalPressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetFraction: 0.18, waterVaporFraction: 0.1, totalPressure: 100 },
  output: { dryFraction: 0.19999999999999998, wetPartialPressure: 18 },
} satisfies ToolExample<Input, Output>;
export const respiratoryGasDryWetFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/respiratory-gas-dry-wet-fraction-term",
    title: "Respiratory Gas Dry Wet Fraction Term Tool",
    description:
      "Wet-to-dry gas fraction with an explicit water-vapor fraction, without blood-gas conversion or gas-administration guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetFraction: { type: "number", minimum: 0 },
        waterVaporFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        totalPressure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wetFraction", "waterVaporFraction", "totalPressure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryFraction: { type: "number" },
        wetPartialPressure: { type: "number" },
      },
      required: ["dryFraction", "wetPartialPressure"],
    },
    ports: {
      inputs: [
        {
          id: "wetFraction",
          label: "Wet Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterVaporFraction",
          label: "Water Vapor Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPressure",
          label: "Total Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryFraction",
          label: "Dry Fraction",
          valueType: { type: "number" },
        },
        {
          id: "wetPartialPressure",
          label: "Wet Partial Pressure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = respiratoryGasDryWetFractionTermTool.execute;
export default respiratoryGasDryWetFractionTermTool;
