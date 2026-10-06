import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetBasisConcentration: number;
  readonly waterVaporFraction: number;
};
export type Output = {
  readonly dryBasisFactor: number;
  readonly dryBasisConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetBasisConcentration: { type: "number", minimum: 0 },
    waterVaporFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["wetBasisConcentration", "waterVaporFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryBasisFactor: { type: "number" },
    dryBasisConcentration: { type: "number" },
  },
  required: ["dryBasisFactor", "dryBasisConcentration"],
} as const;
/** Convert a wet gas-volume-basis concentration to a dry basis using an explicit water-vapor volume fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetBasisConcentration, waterVaporFraction } = request;
  const compute = (): Output => {
    H.domain(
      wetBasisConcentration >= 0 &&
        waterVaporFraction >= 0 &&
        waterVaporFraction < 1,
      "wetBasisConcentration",
    );
    return {
      dryBasisFactor: 1 / (1 - waterVaporFraction),
      dryBasisConcentration: wetBasisConcentration / (1 - waterVaporFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetBasisConcentration: 80, waterVaporFraction: 0.2 },
  output: { dryBasisFactor: 1.25, dryBasisConcentration: 100 },
} satisfies ToolExample<Input, Output>;
export const emissionWetdryBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-chemistry", "atmospheric chemistry", "chemistry"],
      keywords: ["atmospheric chemistry", "chemistry"],
    },
    id: "atmospheric-chemistry/emission-wet-dry-basis-factor",
    title: "Emission Wet Dry Basis Factor",
    description:
      "Convert a wet gas-volume-basis concentration to a dry basis using an explicit water-vapor volume fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetBasisConcentration: { type: "number", minimum: 0 },
        waterVaporFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["wetBasisConcentration", "waterVaporFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryBasisFactor: { type: "number" },
        dryBasisConcentration: { type: "number" },
      },
      required: ["dryBasisFactor", "dryBasisConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "wetBasisConcentration",
          label: "Wet Basis Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterVaporFraction",
          label: "Water Vapor Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryBasisFactor",
          label: "Dry Basis Factor",
          valueType: { type: "number" },
        },
        {
          id: "dryBasisConcentration",
          label: "Dry Basis Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = emissionWetdryBasisFactorTool.execute;
export default emissionWetdryBasisFactorTool;
