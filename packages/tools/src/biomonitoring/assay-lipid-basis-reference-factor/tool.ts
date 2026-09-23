import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetBasisConcentration: number;
  readonly lipidFraction: number;
  readonly referenceLipidFraction: number;
};
export type Output = {
  readonly lipidBasis: number;
  readonly referenceEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetBasisConcentration: { type: "number" },
    lipidFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    referenceLipidFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "wetBasisConcentration",
    "lipidFraction",
    "referenceLipidFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lipidBasis: { type: "number" },
    referenceEquivalent: { type: "number" },
  },
  required: ["lipidBasis", "referenceEquivalent"],
} as const;
/** Convert compatible supplied mass-basis research assay fractions without interpreting health effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetBasisConcentration, lipidFraction, referenceLipidFraction } =
    request;
  const compute = (): Output => {
    H.domain(lipidFraction > 0 && lipidFraction <= 1);
    H.probability(referenceLipidFraction);
    return {
      lipidBasis: wetBasisConcentration / lipidFraction,
      referenceEquivalent:
        (wetBasisConcentration / lipidFraction) * referenceLipidFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wetBasisConcentration: 2,
    lipidFraction: 0.1,
    referenceLipidFraction: 0.05,
  },
  output: { lipidBasis: 20, referenceEquivalent: 1 },
} satisfies ToolExample<Input, Output>;
export const assayLipidBasisReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/assay-lipid-basis-reference-factor",
    title: "Assay Lipid Basis Reference Factor Tool",
    description:
      "Convert compatible supplied mass-basis research assay fractions without interpreting health effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetBasisConcentration: { type: "number" },
        lipidFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        referenceLipidFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "wetBasisConcentration",
        "lipidFraction",
        "referenceLipidFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lipidBasis: { type: "number" },
        referenceEquivalent: { type: "number" },
      },
      required: ["lipidBasis", "referenceEquivalent"],
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
          id: "lipidFraction",
          label: "Lipid Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLipidFraction",
          label: "Reference Lipid Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lipidBasis",
          label: "Lipid Basis",
          valueType: { type: "number" },
        },
        {
          id: "referenceEquivalent",
          label: "Reference Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assayLipidBasisReferenceFactorTool.execute;
export default assayLipidBasisReferenceFactorTool;
