import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentrationAtReference: number;
  readonly ambientPressure: number;
  readonly referencePressure: number;
};
export type Output = {
  readonly pressureCorrectedConcentration: number;
  readonly pressureFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentrationAtReference: { type: "number", minimum: 0 },
    ambientPressure: { type: "number", exclusiveMinimum: 0 },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "concentrationAtReference",
    "ambientPressure",
    "referencePressure",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureCorrectedConcentration: { type: "number" },
    pressureFactor: { type: "number" },
  },
  required: ["pressureCorrectedConcentration", "pressureFactor"],
} as const;
/** Scale a fixed-temperature ideal-gas mass-per-volume concentration by an explicit ambient/reference pressure ratio at unchanged mole fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentrationAtReference, ambientPressure, referencePressure } =
    request;
  const compute = (): Output => {
    H.domain(concentrationAtReference >= 0, "concentrationAtReference");
    (H.domain(ambientPressure > 0, "ambientPressure"), ambientPressure);
    (H.domain(referencePressure > 0, "referencePressure"), referencePressure);
    return {
      pressureCorrectedConcentration:
        (concentrationAtReference * ambientPressure) / referencePressure,
      pressureFactor: ambientPressure / referencePressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    concentrationAtReference: 20,
    ambientPressure: 90000,
    referencePressure: 100000,
  },
  output: { pressureCorrectedConcentration: 18, pressureFactor: 0.9 },
} satisfies ToolExample<Input, Output>;
export const ambientGasPressureCorrectionTool = H.defineSchemaCalculation<
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
    id: "atmospheric-chemistry/ambient-gas-pressure-correction",
    title: "Ambient Gas Pressure Correction",
    description:
      "Scale a fixed-temperature ideal-gas mass-per-volume concentration by an explicit ambient/reference pressure ratio at unchanged mole fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentrationAtReference: { type: "number", minimum: 0 },
        ambientPressure: { type: "number", exclusiveMinimum: 0 },
        referencePressure: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "concentrationAtReference",
        "ambientPressure",
        "referencePressure",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressureCorrectedConcentration: { type: "number" },
        pressureFactor: { type: "number" },
      },
      required: ["pressureCorrectedConcentration", "pressureFactor"],
    },
    ports: {
      inputs: [
        {
          id: "concentrationAtReference",
          label: "Concentration At Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ambientPressure",
          label: "Ambient Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePressure",
          label: "Reference Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pressureCorrectedConcentration",
          label: "Pressure Corrected Concentration",
          valueType: { type: "number" },
        },
        {
          id: "pressureFactor",
          label: "Pressure Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ambientGasPressureCorrectionTool.execute;
export default ambientGasPressureCorrectionTool;
