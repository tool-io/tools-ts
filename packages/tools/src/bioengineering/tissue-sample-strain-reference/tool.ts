import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly referenceLength: number;
};
export type Output = { readonly engineeringStrain: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    referenceLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["length", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { engineeringStrain: { type: "number" } },
  required: ["engineeringStrain"],
} as const;
/** Compute engineering strain for a supplied research sample, without constitutive or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, referenceLength } = request;
  const compute = (): Output => {
    H.domain(length >= 0);
    H.positive(referenceLength);
    return { engineeringStrain: (length - referenceLength) / referenceLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 12, referenceLength: 10 },
  output: { engineeringStrain: 0.2 },
} satisfies ToolExample<Input, Output>;
export const tissueSampleStrainReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/tissue-sample-strain-reference",
    title: "Tissue Sample Strain Reference Tool",
    description:
      "Compute engineering strain for a supplied research sample, without constitutive or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        referenceLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["length", "referenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { engineeringStrain: { type: "number" } },
      required: ["engineeringStrain"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "engineeringStrain",
          label: "Engineering Strain",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueSampleStrainReferenceTool.execute;
export default tissueSampleStrainReferenceTool;
