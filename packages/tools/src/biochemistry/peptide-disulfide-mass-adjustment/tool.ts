import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reducedMass: number;
  readonly bonds: number;
  readonly hydrogenAtomMass: number;
};
export type Output = {
  readonly massLoss: number;
  readonly oxidizedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reducedMass: { type: "number" },
    bonds: { type: "integer", minimum: 0 },
    hydrogenAtomMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reducedMass", "bonds", "hydrogenAtomMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massLoss: { type: "number" },
    oxidizedMass: { type: "number" },
  },
  required: ["massLoss", "oxidizedMass"],
} as const;
/** Each intramolecular disulfide formation removes two neutral hydrogen-atom masses on the caller-selected mass basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reducedMass, bonds, hydrogenAtomMass } = request;
  const compute = (): Output => {
    H.integer(bonds, 0);
    H.positive(hydrogenAtomMass);
    H.domain(reducedMass >= 2 * bonds * hydrogenAtomMass);
    return {
      massLoss: 2 * bonds * hydrogenAtomMass,
      oxidizedMass: reducedMass - 2 * bonds * hydrogenAtomMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reducedMass: 1000, bonds: 2, hydrogenAtomMass: 1 },
  output: { massLoss: 4, oxidizedMass: 996 },
} satisfies ToolExample<Input, Output>;
export const peptideDisulfideMassAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/peptide-disulfide-mass-adjustment",
    title: "Peptide Disulfide Mass Adjustment Tool",
    description:
      "Each intramolecular disulfide formation removes two neutral hydrogen-atom masses on the caller-selected mass basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reducedMass: { type: "number" },
        bonds: { type: "integer", minimum: 0 },
        hydrogenAtomMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reducedMass", "bonds", "hydrogenAtomMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massLoss: { type: "number" },
        oxidizedMass: { type: "number" },
      },
      required: ["massLoss", "oxidizedMass"],
    },
    ports: {
      inputs: [
        {
          id: "reducedMass",
          label: "Reduced Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bonds",
          label: "Bonds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "hydrogenAtomMass",
          label: "Hydrogen Atom Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "massLoss", label: "Mass Loss", valueType: { type: "number" } },
        {
          id: "oxidizedMass",
          label: "Oxidized Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = peptideDisulfideMassAdjustmentTool.execute;
export default peptideDisulfideMassAdjustmentTool;
