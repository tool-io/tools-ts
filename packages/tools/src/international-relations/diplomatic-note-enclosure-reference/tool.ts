import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noteId: string;
  readonly enclosureId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noteId: { type: "string", maxLength: 8192, minLength: 1 },
    enclosureId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["noteId", "enclosureId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit diplomatic-note enclosure reference by version without accessing documents. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noteId, enclosureId, version } = request;
  const compute = (): Output => {
    H.domain(noteId.length > 0, "noteId");
    H.domain(enclosureId.length > 0, "enclosureId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([noteId, enclosureId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { noteId: "NOTE17", enclosureId: "ENC2", version: "v2" },
  output: { token: '["NOTE17","ENC2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const diplomaticNoteEnclosureReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "international-relations",
        "international relations",
        "social sciences",
      ],
      keywords: ["international relations", "social sciences"],
    },
    id: "international-relations/diplomatic-note-enclosure-reference",
    title: "Diplomatic Note Enclosure Reference",
    description:
      "Qualify an explicit diplomatic-note enclosure reference by version without accessing documents.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        noteId: { type: "string", maxLength: 8192, minLength: 1 },
        enclosureId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["noteId", "enclosureId", "version"],
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
          id: "noteId",
          label: "Note Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "enclosureId",
          label: "Enclosure Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = diplomaticNoteEnclosureReferenceTool.execute;
export default diplomaticNoteEnclosureReferenceTool;
