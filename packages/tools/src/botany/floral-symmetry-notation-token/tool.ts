import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taxonWording: string;
  readonly suppliedNotation: string;
  readonly notationSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxonWording: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedNotation: { type: "string", maxLength: 8192, minLength: 1 },
    notationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["taxonWording", "suppliedNotation", "notationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve an explicitly supplied floral-symmetry notation and source without interpreting symbolic conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taxonWording, suppliedNotation, notationSource } = request;
  const compute = (): Output => {
    H.domain(
      taxonWording.length > 0 &&
        suppliedNotation.length > 0 &&
        notationSource.length > 0,
      "taxonWording",
    );
    return {
      label:
        taxonWording +
        "; symmetry=" +
        JSON.stringify(suppliedNotation) +
        " [" +
        notationSource +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taxonWording: "Taxon A",
    suppliedNotation: "*",
    notationSource: "Flora A",
  },
  output: { label: 'Taxon A; symmetry="*" [Flora A]' },
} satisfies ToolExample<Input, Output>;
export const floralSymmetryNotationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["botany", "biology"],
      keywords: ["botany", "biology"],
    },
    id: "botany/floral-symmetry-notation-token",
    title: "Floral Symmetry Notation Token",
    description:
      "Preserve an explicitly supplied floral-symmetry notation and source without interpreting symbolic conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxonWording: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedNotation: { type: "string", maxLength: 8192, minLength: 1 },
        notationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["taxonWording", "suppliedNotation", "notationSource"],
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
          id: "taxonWording",
          label: "Taxon Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedNotation",
          label: "Supplied Notation",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "notationSource",
          label: "Notation Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = floralSymmetryNotationTokenTool.execute;
export default floralSymmetryNotationTokenTool;
