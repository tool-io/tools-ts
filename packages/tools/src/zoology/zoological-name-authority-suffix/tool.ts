import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nameWording: string;
  readonly authorityWording: string;
  readonly parenthesize: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nameWording: { type: "string", maxLength: 8192, minLength: 1 },
    authorityWording: { type: "string", maxLength: 8192, minLength: 1 },
    parenthesize: { type: "boolean" },
  },
  required: ["nameWording", "authorityWording", "parenthesize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format explicit zoological authority wording with a caller-selected parenthesis convention without validating nomenclature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nameWording, authorityWording, parenthesize } = request;
  const compute = (): Output => {
    H.domain(
      nameWording.length > 0 && authorityWording.length > 0,
      "nameWording",
    );
    return {
      label:
        nameWording +
        " " +
        (parenthesize ? "(" + authorityWording + ")" : authorityWording),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nameWording: "Species A",
    authorityWording: "Author, 1900",
    parenthesize: true,
  },
  output: { label: "Species A (Author, 1900)" },
} satisfies ToolExample<Input, Output>;
export const zoologicalNameAuthoritySuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["zoology", "biology"],
      keywords: ["zoology", "biology"],
    },
    id: "zoology/zoological-name-authority-suffix",
    title: "Zoological Name Authority Suffix",
    description:
      "Format explicit zoological authority wording with a caller-selected parenthesis convention without validating nomenclature.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nameWording: { type: "string", maxLength: 8192, minLength: 1 },
        authorityWording: { type: "string", maxLength: 8192, minLength: 1 },
        parenthesize: { type: "boolean" },
      },
      required: ["nameWording", "authorityWording", "parenthesize"],
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
          id: "nameWording",
          label: "Name Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authorityWording",
          label: "Authority Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parenthesize",
          label: "Parenthesize",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = zoologicalNameAuthoritySuffixTool.execute;
export default zoologicalNameAuthoritySuffixTool;
