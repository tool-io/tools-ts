import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nameWording: string;
  readonly suppliedAuthorAbbreviation: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nameWording: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAuthorAbbreviation: {
      type: "string",
      maxLength: 8192,
      minLength: 1,
    },
  },
  required: ["nameWording", "suppliedAuthorAbbreviation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Append an explicitly supplied botanical author abbreviation without resolving an author registry or taxonomic name. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nameWording, suppliedAuthorAbbreviation } = request;
  const compute = (): Output => {
    H.domain(
      nameWording.length > 0 && suppliedAuthorAbbreviation.length > 0,
      "nameWording",
    );
    return { label: nameWording + " " + suppliedAuthorAbbreviation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nameWording: "Plant A", suppliedAuthorAbbreviation: "A.Author" },
  output: { label: "Plant A A.Author" },
} satisfies ToolExample<Input, Output>;
export const botanicalNameAuthorAbbreviationTool = H.defineSchemaCalculation<
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
    id: "botany/botanical-name-author-abbreviation",
    title: "Botanical Name Author Abbreviation",
    description:
      "Append an explicitly supplied botanical author abbreviation without resolving an author registry or taxonomic name.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nameWording: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAuthorAbbreviation: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["nameWording", "suppliedAuthorAbbreviation"],
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
          id: "suppliedAuthorAbbreviation",
          label: "Supplied Author Abbreviation",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = botanicalNameAuthorAbbreviationTool.execute;
export default botanicalNameAuthorAbbreviationTool;
