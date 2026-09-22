import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massConcentration: number;
  readonly molarMass: number;
};
export type Output = { readonly molarConcentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massConcentration: { type: "number", minimum: 0 },
    molarMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["massConcentration", "molarMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { molarConcentration: { type: "number" } },
  required: ["molarConcentration"],
} as const;
/** Convert supplied g/L protein concentration and g/mol molar mass to mol/L. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { massConcentration, molarMass } = request;
  const compute = (): Output => {
    H.domain(massConcentration >= 0);
    H.positive(molarMass);
    return { molarConcentration: massConcentration / molarMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { massConcentration: 2, molarMass: 50000 },
  output: { molarConcentration: 0.00004 },
} satisfies ToolExample<Input, Output>;
export const proteinMassMolarityRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/protein-mass-molarity-ratio",
    title: "Protein Mass Molarity Ratio Tool",
    description:
      "Convert supplied g/L protein concentration and g/mol molar mass to mol/L.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massConcentration: { type: "number", minimum: 0 },
        molarMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["massConcentration", "molarMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { molarConcentration: { type: "number" } },
      required: ["molarConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "massConcentration",
          label: "Mass Concentration",
          required: true,
          valueType: { type: "number", unit: "g/L" },
        },
        {
          id: "molarMass",
          label: "Molar Mass",
          required: true,
          valueType: { type: "number", unit: "g/mol" },
        },
      ],
      outputs: [
        {
          id: "molarConcentration",
          label: "Molar Concentration",
          valueType: { type: "number", unit: "mol/L" },
        },
      ],
    },
  },
  calculate,
});
export const run = proteinMassMolarityRatioTool.execute;
export default proteinMassMolarityRatioTool;
