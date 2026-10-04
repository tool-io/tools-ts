import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly title: string; readonly editionNumber: number };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", maxLength: 8192 },
    editionNumber: { type: "integer", minimum: 1 },
  },
  required: ["title", "editionNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Append an explicit numbered edition to a publication display title. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { title, editionNumber } = request;
  const compute = (): Output => {
    H.domain(title.length > 0, "title");
    (H.domain(
      Number.isSafeInteger(editionNumber) &&
        editionNumber >= 1 &&
        editionNumber <= Number.MAX_SAFE_INTEGER,
      "editionNumber",
    ),
      editionNumber);
    return { label: title + " (edition " + editionNumber + ")" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { title: "Collected Works", editionNumber: 3 },
  output: { label: "Collected Works (edition 3)" },
} satisfies ToolExample<Input, Output>;
export const culturalPublicationEditionSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/cultural-publication-edition-suffix",
    title: "Cultural Publication Edition Suffix Tool",
    description:
      "Append an explicit numbered edition to a publication display title.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string", maxLength: 8192 },
        editionNumber: { type: "integer", minimum: 1 },
      },
      required: ["title", "editionNumber"],
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
          id: "title",
          label: "Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "editionNumber",
          label: "Edition Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = culturalPublicationEditionSuffixTool.execute;
export default culturalPublicationEditionSuffixTool;
