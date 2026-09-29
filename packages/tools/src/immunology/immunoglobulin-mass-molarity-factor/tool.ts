import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gramsPerLiter: number;
  readonly molarMassGramsPerMole: number;
  readonly dilution: number;
};
export type Output = {
  readonly molesPerLiter: number;
  readonly nanomolesPerLiter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gramsPerLiter: { type: "number", minimum: 0 },
    molarMassGramsPerMole: { type: "number", exclusiveMinimum: 0 },
    dilution: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["gramsPerLiter", "molarMassGramsPerMole", "dilution"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molesPerLiter: { type: "number" },
    nanomolesPerLiter: { type: "number" },
  },
  required: ["molesPerLiter", "nanomolesPerLiter"],
} as const;
/** Mass-to-molar conversion using an explicitly supplied molecular mass and back-dilution factor, not a universal immunoglobulin mass. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gramsPerLiter, molarMassGramsPerMole, dilution } = request;
  const compute = (): Output => {
    H.domain(gramsPerLiter >= 0);
    H.positive(molarMassGramsPerMole);
    H.positive(dilution);
    return {
      molesPerLiter: (gramsPerLiter * dilution) / molarMassGramsPerMole,
      nanomolesPerLiter:
        (1e9 * gramsPerLiter * dilution) / molarMassGramsPerMole,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gramsPerLiter: 0.15, molarMassGramsPerMole: 150000, dilution: 1 },
  output: { molesPerLiter: 0.000001, nanomolesPerLiter: 1000 },
} satisfies ToolExample<Input, Output>;
export const immunoglobulinMassMolarityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/immunoglobulin-mass-molarity-factor",
    title: "Immunoglobulin Mass Molarity Factor Tool",
    description:
      "Mass-to-molar conversion using an explicitly supplied molecular mass and back-dilution factor, not a universal immunoglobulin mass.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gramsPerLiter: { type: "number", minimum: 0 },
        molarMassGramsPerMole: { type: "number", exclusiveMinimum: 0 },
        dilution: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["gramsPerLiter", "molarMassGramsPerMole", "dilution"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        molesPerLiter: { type: "number" },
        nanomolesPerLiter: { type: "number" },
      },
      required: ["molesPerLiter", "nanomolesPerLiter"],
    },
    ports: {
      inputs: [
        {
          id: "gramsPerLiter",
          label: "Grams Per Liter",
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
          id: "dilution",
          label: "Dilution",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "molesPerLiter",
          label: "Moles Per Liter",
          valueType: { type: "number" },
        },
        {
          id: "nanomolesPerLiter",
          label: "Nanomoles Per Liter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = immunoglobulinMassMolarityFactorTool.execute;
export default immunoglobulinMassMolarityFactorTool;
