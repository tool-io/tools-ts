import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massConcentrationMicrogramsPerCubicMeter: number;
  readonly molarMassGramsPerMole: number;
  readonly absoluteCharge: number;
};
export type Output = { readonly nanoequivalentsPerCubicMeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massConcentrationMicrogramsPerCubicMeter: { type: "number", minimum: 0 },
    molarMassGramsPerMole: { type: "number", exclusiveMinimum: 0 },
    absoluteCharge: { type: "integer", minimum: 1 },
  },
  required: [
    "massConcentrationMicrogramsPerCubicMeter",
    "molarMassGramsPerMole",
    "absoluteCharge",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nanoequivalentsPerCubicMeter: { type: "number" } },
  required: ["nanoequivalentsPerCubicMeter"],
} as const;
/** Convert a measured aerosol-ion mass concentration to nanoequivalents per cubic meter using explicit molar mass and absolute ionic charge. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    massConcentrationMicrogramsPerCubicMeter,
    molarMassGramsPerMole,
    absoluteCharge,
  } = request;
  const compute = (): Output => {
    H.domain(
      massConcentrationMicrogramsPerCubicMeter >= 0,
      "massConcentrationMicrogramsPerCubicMeter",
    );
    (H.domain(molarMassGramsPerMole > 0, "molarMassGramsPerMole"),
      molarMassGramsPerMole);
    (H.domain(
      Number.isSafeInteger(absoluteCharge) &&
        absoluteCharge >= 1 &&
        absoluteCharge <= Number.MAX_SAFE_INTEGER,
      "absoluteCharge",
    ),
      absoluteCharge);
    return {
      nanoequivalentsPerCubicMeter:
        ((massConcentrationMicrogramsPerCubicMeter * 1000) /
          molarMassGramsPerMole) *
        absoluteCharge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    massConcentrationMicrogramsPerCubicMeter: 4.8,
    molarMassGramsPerMole: 96,
    absoluteCharge: 2,
  },
  output: { nanoequivalentsPerCubicMeter: 100 },
} satisfies ToolExample<Input, Output>;
export const aerosolIonEquivalentConcentrationTool = H.defineSchemaCalculation<
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
    id: "atmospheric-chemistry/aerosol-ion-equivalent-concentration",
    title: "Aerosol Ion Equivalent Concentration",
    description:
      "Convert a measured aerosol-ion mass concentration to nanoequivalents per cubic meter using explicit molar mass and absolute ionic charge.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massConcentrationMicrogramsPerCubicMeter: {
          type: "number",
          minimum: 0,
        },
        molarMassGramsPerMole: { type: "number", exclusiveMinimum: 0 },
        absoluteCharge: { type: "integer", minimum: 1 },
      },
      required: [
        "massConcentrationMicrogramsPerCubicMeter",
        "molarMassGramsPerMole",
        "absoluteCharge",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nanoequivalentsPerCubicMeter: { type: "number" } },
      required: ["nanoequivalentsPerCubicMeter"],
    },
    ports: {
      inputs: [
        {
          id: "massConcentrationMicrogramsPerCubicMeter",
          label: "Mass Concentration Micrograms Per Cubic Meter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "molarMassGramsPerMole",
          label: "Molar Mass Grams Per Mole",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "absoluteCharge",
          label: "Absolute Charge",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nanoequivalentsPerCubicMeter",
          label: "Nanoequivalents Per Cubic Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aerosolIonEquivalentConcentrationTool.execute;
export default aerosolIonEquivalentConcentrationTool;
