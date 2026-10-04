import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residueMass: number;
  readonly dryFraction: number;
  readonly carbonFraction: number;
  readonly retainedFraction: number;
};
export type Output = { readonly retainedCarbon: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residueMass: { type: "number", minimum: 0 },
    dryFraction: { type: "number", minimum: 0, maximum: 1 },
    carbonFraction: { type: "number", minimum: 0, maximum: 1 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "residueMass",
    "dryFraction",
    "carbonFraction",
    "retainedFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { retainedCarbon: { type: "number" } },
  required: ["retainedCarbon"],
} as const;
/** Calculate crop residue retained carbon factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residueMass, dryFraction, carbonFraction, retainedFraction } =
    request;
  const compute = (): Output => {
    H.domain(residueMass >= 0);
    H.probability(dryFraction);
    H.probability(carbonFraction);
    H.probability(retainedFraction);
    return {
      retainedCarbon:
        residueMass * dryFraction * carbonFraction * retainedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    residueMass: 1000,
    dryFraction: 0.8,
    carbonFraction: 0.4,
    retainedFraction: 0.5,
  },
  output: { retainedCarbon: 160 },
} satisfies ToolExample<Input, Output>;
export const cropResidueRetainedCarbonFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/crop-residue-retained-carbon-factor",
    title: "Crop Residue Retained Carbon Factor Tool",
    description:
      "Calculate crop residue retained carbon factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residueMass: { type: "number", minimum: 0 },
        dryFraction: { type: "number", minimum: 0, maximum: 1 },
        carbonFraction: { type: "number", minimum: 0, maximum: 1 },
        retainedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "residueMass",
        "dryFraction",
        "carbonFraction",
        "retainedFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { retainedCarbon: { type: "number" } },
      required: ["retainedCarbon"],
    },
    ports: {
      inputs: [
        {
          id: "residueMass",
          label: "Residue Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "carbonFraction",
          label: "Carbon Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "retainedCarbon",
          label: "Retained Carbon",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropResidueRetainedCarbonFactorTool.execute;
export default cropResidueRetainedCarbonFactorTool;
