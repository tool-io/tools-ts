import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly passageId: string;
  readonly recalledDurationText: string;
  readonly sourceNote: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    passageId: { type: "string", maxLength: 8192, minLength: 1 },
    recalledDurationText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceNote: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["passageId", "recalledDurationText", "sourceNote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied narrative flashback duration transcription and source without resolving fictional chronology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { passageId, recalledDurationText, sourceNote } = request;
  const compute = (): Output => {
    H.domain(passageId.length > 0, "passageId");
    H.domain(recalledDurationText.length > 0, "recalledDurationText");
    H.domain(sourceNote.length > 0, "sourceNote");
    return {
      token: JSON.stringify([passageId, recalledDurationText, sourceNote]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    passageId: "P17",
    recalledDurationText: "three winters",
    sourceNote: "explicit narrator",
  },
  output: { token: '["P17","three winters","explicit narrator"]' },
} satisfies ToolExample<Input, Output>;
export const narrativeAnalepsisDurationTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/narrative-analepsis-duration-tag",
    title: "Narrative Analepsis Duration Tag",
    description:
      "Preserve a supplied narrative flashback duration transcription and source without resolving fictional chronology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        passageId: { type: "string", maxLength: 8192, minLength: 1 },
        recalledDurationText: { type: "string", maxLength: 8192, minLength: 1 },
        sourceNote: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["passageId", "recalledDurationText", "sourceNote"],
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
          id: "passageId",
          label: "Passage Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recalledDurationText",
          label: "Recalled Duration Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceNote",
          label: "Source Note",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = narrativeAnalepsisDurationTagTool.execute;
export default narrativeAnalepsisDurationTagTool;
