import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly editionName: string;
  readonly abbreviation: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionName: { type: "string", maxLength: 8192 },
    abbreviation: { type: "string", maxLength: 8192 },
  },
  required: ["editionName", "abbreviation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format a caller-supplied scripture-edition name and abbreviation without resolving a factual edition catalogue. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { editionName, abbreviation } = request;
  const compute = (): Output => {
    H.domain(editionName.length > 0 && abbreviation.length > 0, "editionName");
    return { label: editionName + " (" + abbreviation + ")" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { editionName: "Study Edition", abbreviation: "SE" },
  output: { label: "Study Edition (SE)" },
} satisfies ToolExample<Input, Output>;
export const scriptureEditionAbbreviationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/scripture-edition-abbreviation",
    title: "Scripture Edition Abbreviation Tool",
    description:
      "Format a caller-supplied scripture-edition name and abbreviation without resolving a factual edition catalogue.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        editionName: { type: "string", maxLength: 8192 },
        abbreviation: { type: "string", maxLength: 8192 },
      },
      required: ["editionName", "abbreviation"],
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
          id: "editionName",
          label: "Edition Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "abbreviation",
          label: "Abbreviation",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = scriptureEditionAbbreviationTool.execute;
export default scriptureEditionAbbreviationTool;
