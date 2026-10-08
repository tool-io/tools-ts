import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly suppliedTimeText: string;
  readonly ambiguityNote: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTimeText: { type: "string", maxLength: 8192, minLength: 1 },
    ambiguityNote: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["entryId", "suppliedTimeText", "ambiguityNote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied nutrition-diary time transcription and explicit ambiguity note without inferring a timestamp. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryId, suppliedTimeText, ambiguityNote } = request;
  const compute = (): Output => {
    H.domain(entryId.length > 0, "entryId");
    H.domain(suppliedTimeText.length > 0, "suppliedTimeText");
    H.domain(ambiguityNote.length > 0, "ambiguityNote");
    return {
      token: JSON.stringify([entryId, suppliedTimeText, ambiguityNote]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entryId: "E17",
    suppliedTimeText: "01:30",
    ambiguityNote: "DST repeated hour",
  },
  output: { token: '["E17","01:30","DST repeated hour"]' },
} satisfies ToolExample<Input, Output>;
export const nutritionDiaryEntryTimeAmbiguityLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dietetics/nutrition-diary-entry-time-ambiguity-label",
      title: "Nutrition Diary Entry Time Ambiguity Label Tool",
      description:
        "Preserve a supplied nutrition-diary time transcription and explicit ambiguity note without inferring a timestamp.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          entryId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedTimeText: { type: "string", maxLength: 8192, minLength: 1 },
          ambiguityNote: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["entryId", "suppliedTimeText", "ambiguityNote"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "entryId",
            label: "Entry Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedTimeText",
            label: "Supplied Time Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "ambiguityNote",
            label: "Ambiguity Note",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = nutritionDiaryEntryTimeAmbiguityLabelTool.execute;
export default nutritionDiaryEntryTimeAmbiguityLabelTool;
