import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moles: number;
  readonly charge: number;
  readonly molarMass: number;
};
export type Output = {
  readonly signedEquivalents: number;
  readonly magnitudeEquivalents: number;
  readonly mass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moles: { type: "number", minimum: 0 },
    charge: { type: "integer" },
    molarMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["moles", "charge", "molarMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedEquivalents: { type: "number" },
    magnitudeEquivalents: { type: "number" },
    mass: { type: "number" },
  },
  required: ["signedEquivalents", "magnitudeEquivalents", "mass"],
} as const;
/** Calculate one species molar charge equivalent from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moles, charge, molarMass } = request;
  const compute = (): Output => {
    H.domain(moles >= 0 && charge !== 0);
    H.positive(molarMass);
    return {
      signedEquivalents: moles * charge,
      magnitudeEquivalents: moles * Math.abs(charge),
      mass: moles * molarMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { moles: 2, charge: -2, molarMass: 50 },
  output: { signedEquivalents: -4, magnitudeEquivalents: 4, mass: 100 },
} satisfies ToolExample<Input, Output>;
export const oneSpeciesMolarChargeEquivalentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/one-species-molar-charge-equivalent",
    title: "One Species Molar Charge Equivalent Tool",
    description:
      "Calculate one species molar charge equivalent from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moles: { type: "number", minimum: 0 },
        charge: { type: "integer" },
        molarMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["moles", "charge", "molarMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedEquivalents: { type: "number" },
        magnitudeEquivalents: { type: "number" },
        mass: { type: "number" },
      },
      required: ["signedEquivalents", "magnitudeEquivalents", "mass"],
    },
    ports: {
      inputs: [
        {
          id: "moles",
          label: "Moles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "charge",
          label: "Charge",
          required: true,
          valueType: { type: "integer" },
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
          id: "signedEquivalents",
          label: "Signed Equivalents",
          valueType: { type: "number" },
        },
        {
          id: "magnitudeEquivalents",
          label: "Magnitude Equivalents",
          valueType: { type: "number" },
        },
        { id: "mass", label: "Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = oneSpeciesMolarChargeEquivalentTool.execute;
export default oneSpeciesMolarChargeEquivalentTool;
