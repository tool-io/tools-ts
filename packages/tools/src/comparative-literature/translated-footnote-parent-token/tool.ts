import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noteId: string;
  readonly parentId: string;
  readonly expectedParent: string;
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
};
export type Output = {
  readonly linked: boolean;
  readonly sameLanguage: boolean;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noteId: { type: "string", maxLength: 8192 },
    parentId: { type: "string", maxLength: 8192 },
    expectedParent: { type: "string", maxLength: 8192 },
    sourceLanguage: { type: "string", maxLength: 8192 },
    targetLanguage: { type: "string", maxLength: 8192 },
  },
  required: [
    "noteId",
    "parentId",
    "expectedParent",
    "sourceLanguage",
    "targetLanguage",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linked: { type: "boolean" },
    sameLanguage: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["linked", "sameLanguage", "key"],
} as const;
/** Compare supplied note-parent links and language labels without translating a note. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noteId, parentId, expectedParent, sourceLanguage, targetLanguage } =
    request;
  const compute = (): Output => {
    H.domain(noteId.length > 0 && parentId.length > 0);
    return {
      linked: parentId === expectedParent,
      sameLanguage: sourceLanguage === targetLanguage,
      key: JSON.stringify([parentId, noteId, targetLanguage]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    noteId: "n2",
    parentId: "n1",
    expectedParent: "n1",
    sourceLanguage: "fr",
    targetLanguage: "en",
  },
  output: { linked: true, sameLanguage: false, key: '["n1","n2","en"]' },
} satisfies ToolExample<Input, Output>;
export const translatedFootnoteParentTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/translated-footnote-parent-token",
    title: "Translated Footnote Parent Token Tool",
    description:
      "Compare supplied note-parent links and language labels without translating a note.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        noteId: { type: "string", maxLength: 8192 },
        parentId: { type: "string", maxLength: 8192 },
        expectedParent: { type: "string", maxLength: 8192 },
        sourceLanguage: { type: "string", maxLength: 8192 },
        targetLanguage: { type: "string", maxLength: 8192 },
      },
      required: [
        "noteId",
        "parentId",
        "expectedParent",
        "sourceLanguage",
        "targetLanguage",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linked: { type: "boolean" },
        sameLanguage: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["linked", "sameLanguage", "key"],
    },
    ports: {
      inputs: [
        {
          id: "noteId",
          label: "Note Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentId",
          label: "Parent Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedParent",
          label: "Expected Parent",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceLanguage",
          label: "Source Language",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetLanguage",
          label: "Target Language",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "linked", label: "Linked", valueType: { type: "boolean" } },
        {
          id: "sameLanguage",
          label: "Same Language",
          valueType: { type: "boolean" },
        },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = translatedFootnoteParentTokenTool.execute;
export default translatedFootnoteParentTokenTool;
