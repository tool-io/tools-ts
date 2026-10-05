import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly surname: string; readonly givenNames: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surname: { type: "string", maxLength: 8192 },
    givenNames: { type: "string", maxLength: 8192 },
  },
  required: ["surname", "givenNames"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format a caller-identified surname and given names with uppercase surname; surname boundaries are never inferred from a full name. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surname, givenNames } = request;
  const compute = (): Output => {
    H.domain(
      surname.trim().length > 0 && givenNames.trim().length > 0,
      "surname",
    );
    return { label: surname.toUpperCase() + ", " + givenNames };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surname: "Silva", givenNames: "Ana Maria" },
  output: { label: "SILVA, Ana Maria" },
} satisfies ToolExample<Input, Output>;
export const brazilianBibliographyAuthorSurnameLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "latin-american-studies/brazilian-bibliography-author-surname-label",
      title: "Brazilian Bibliography Author Surname Label Tool",
      description:
        "Format a caller-identified surname and given names with uppercase surname; surname boundaries are never inferred from a full name.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          surname: { type: "string", maxLength: 8192 },
          givenNames: { type: "string", maxLength: 8192 },
        },
        required: ["surname", "givenNames"],
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
            id: "surname",
            label: "Surname",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "givenNames",
            label: "Given Names",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = brazilianBibliographyAuthorSurnameLabelTool.execute;
export default brazilianBibliographyAuthorSurnameLabelTool;
