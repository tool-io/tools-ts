import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numeratorIsotope: string;
  readonly denominatorIsotope: string;
  readonly referenceSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeratorIsotope: { type: "string", maxLength: 8192, minLength: 1 },
    denominatorIsotope: { type: "string", maxLength: 8192, minLength: 1 },
    referenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["numeratorIsotope", "denominatorIsotope", "referenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit isotope-ratio numerator, denominator, and reference wording without isotope lookup or normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numeratorIsotope, denominatorIsotope, referenceSource } = request;
  const compute = (): Output => {
    H.domain(
      numeratorIsotope.length > 0 &&
        denominatorIsotope.length > 0 &&
        referenceSource.length > 0,
      "numeratorIsotope",
    );
    return {
      label:
        numeratorIsotope +
        "/" +
        denominatorIsotope +
        " [" +
        referenceSource +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    numeratorIsotope: "87Sr",
    denominatorIsotope: "86Sr",
    referenceSource: "Lab standard A",
  },
  output: { label: "87Sr/86Sr [Lab standard A]" },
} satisfies ToolExample<Input, Output>;
export const isotopeRatioDenominatorLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geochemistry", "chemistry"],
      keywords: ["geochemistry", "chemistry"],
    },
    id: "geochemistry/isotope-ratio-denominator-label",
    title: "Isotope Ratio Denominator Label",
    description:
      "Label explicit isotope-ratio numerator, denominator, and reference wording without isotope lookup or normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numeratorIsotope: { type: "string", maxLength: 8192, minLength: 1 },
        denominatorIsotope: { type: "string", maxLength: 8192, minLength: 1 },
        referenceSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["numeratorIsotope", "denominatorIsotope", "referenceSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "numeratorIsotope",
          label: "Numerator Isotope",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "denominatorIsotope",
          label: "Denominator Isotope",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceSource",
          label: "Reference Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = isotopeRatioDenominatorLabelTool.execute;
export default isotopeRatioDenominatorLabelTool;
