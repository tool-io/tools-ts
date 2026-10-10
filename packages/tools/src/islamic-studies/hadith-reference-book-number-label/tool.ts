import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionWording: string;
  readonly bookNumber: number;
  readonly narrationNumber: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionWording: { type: "string", maxLength: 8192, minLength: 1 },
    bookNumber: { type: "integer", minimum: 1 },
    narrationNumber: { type: "integer", minimum: 1 },
  },
  required: ["collectionWording", "bookNumber", "narrationNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format supplied collection-specific hadith reference ordinals without matching numbering systems or assessing authenticity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionWording, bookNumber, narrationNumber } = request;
  const compute = (): Output => {
    H.domain(collectionWording.length > 0, "collectionWording");
    (H.domain(
      Number.isSafeInteger(bookNumber) &&
        bookNumber >= 1 &&
        bookNumber <= Number.MAX_SAFE_INTEGER,
      "bookNumber",
    ),
      bookNumber);
    (H.domain(
      Number.isSafeInteger(narrationNumber) &&
        narrationNumber >= 1 &&
        narrationNumber <= Number.MAX_SAFE_INTEGER,
      "narrationNumber",
    ),
      narrationNumber);
    return {
      label:
        collectionWording +
        "; book " +
        bookNumber +
        ", narration " +
        narrationNumber,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectionWording: "Collection A",
    bookNumber: 3,
    narrationNumber: 17,
  },
  output: { label: "Collection A; book 3, narration 17" },
} satisfies ToolExample<Input, Output>;
export const hadithReferenceBookNumberLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["islamic-studies", "islamic studies", "humanities"],
      keywords: ["islamic studies", "humanities"],
    },
    id: "islamic-studies/hadith-reference-book-number-label",
    title: "Hadith Reference Book Number Label",
    description:
      "Format supplied collection-specific hadith reference ordinals without matching numbering systems or assessing authenticity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionWording: { type: "string", maxLength: 8192, minLength: 1 },
        bookNumber: { type: "integer", minimum: 1 },
        narrationNumber: { type: "integer", minimum: 1 },
      },
      required: ["collectionWording", "bookNumber", "narrationNumber"],
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
          id: "collectionWording",
          label: "Collection Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "bookNumber",
          label: "Book Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "narrationNumber",
          label: "Narration Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hadithReferenceBookNumberLabelTool.execute;
export default hadithReferenceBookNumberLabelTool;
