import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly molality: number; readonly molarMass: number };
export type Output = { readonly massFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molality: { type: "number", minimum: 0 },
    molarMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["molality", "molarMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massFraction: { type: "number" } },
  required: ["massFraction"],
} as const;
/** Convert moles solute per kilogram solvent and kilograms per mole to solute mass fraction. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { molality, molarMass } = input;
  const compute = (): Output => {
    H.domain(molality >= 0);
    H.positive(molarMass);
    const r = molality * molarMass;
    return { massFraction: r / (1 + r) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { molality: 2, molarMass: 0.25 },
  output: { massFraction: 0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const concentrationMolalityMassFractionSolventBasisTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/concentration-molality-mass-fraction-solvent-basis",
      title: "Concentration Molality Mass Fraction Solvent Basis Tool",
      description:
        "Convert moles solute per kilogram solvent and kilograms per mole to solute mass fraction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          molality: { type: "number", minimum: 0 },
          molarMass: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["molality", "molarMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { massFraction: { type: "number" } },
        required: ["massFraction"],
      },
      ports: {
        inputs: [
          {
            id: "molality",
            label: "Molality",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "molarMass",
            label: "Molar Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "massFraction",
            label: "Mass Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = concentrationMolalityMassFractionSolventBasisTool.execute;
export default concentrationMolalityMassFractionSolventBasisTool;
