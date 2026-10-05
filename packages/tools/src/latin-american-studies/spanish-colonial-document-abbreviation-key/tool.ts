import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly abbreviation: string;
  readonly expansion: string;
  readonly sourceId: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    abbreviation: { type: "string", maxLength: 8192 },
    expansion: { type: "string", maxLength: 8192 },
    sourceId: { type: "string", maxLength: 8192 },
  },
  required: ["abbreviation", "expansion", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record a source-specific abbreviation expansion supplied by a transcriber without guessing historical readings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { abbreviation, expansion, sourceId } = request;
  const compute = (): Output => {
    H.domain(
      abbreviation.length > 0 && expansion.length > 0 && sourceId.length > 0,
      "abbreviation",
    );
    return { label: abbreviation + " = " + expansion + " [" + sourceId + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { abbreviation: "q.", expansion: "que", sourceId: "MS17" },
  output: { label: "q. = que [MS17]" },
} satisfies ToolExample<Input, Output>;
export const spanishColonialDocumentAbbreviationKeyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "latin-american-studies/spanish-colonial-document-abbreviation-key",
      title: "Spanish Colonial Document Abbreviation Key Tool",
      description:
        "Record a source-specific abbreviation expansion supplied by a transcriber without guessing historical readings.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          abbreviation: { type: "string", maxLength: 8192 },
          expansion: { type: "string", maxLength: 8192 },
          sourceId: { type: "string", maxLength: 8192 },
        },
        required: ["abbreviation", "expansion", "sourceId"],
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
            id: "abbreviation",
            label: "Abbreviation",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expansion",
            label: "Expansion",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceId",
            label: "Source Id",
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
export const run = spanishColonialDocumentAbbreviationKeyTool.execute;
export default spanishColonialDocumentAbbreviationKeyTool;
