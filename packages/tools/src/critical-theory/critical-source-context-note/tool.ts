import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sourceId: string; readonly contextNote: string };
export type Output = { readonly note: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    contextNote: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "contextNote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { note: { type: "string", maxLength: 8192 } },
  required: ["note"],
} as const;
/** Associate a literal critical-source context note with an explicit source identifier without inferring context automatically. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, contextNote } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0 && contextNote.length > 0, "sourceId");
    return { note: sourceId + ": " + contextNote };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceId: "S17", contextNote: "Quoted from revised edition" },
  output: { note: "S17: Quoted from revised edition" },
} satisfies ToolExample<Input, Output>;
export const criticalSourceContextNoteTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/critical-source-context-note",
    title: "Critical Source Context Note",
    description:
      "Associate a literal critical-source context note with an explicit source identifier without inferring context automatically.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        contextNote: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceId", "contextNote"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { note: { type: "string", maxLength: 8192 } },
      required: ["note"],
    },
    ports: {
      inputs: [
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "contextNote",
          label: "Context Note",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "note", label: "Note", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = criticalSourceContextNoteTool.execute;
export default criticalSourceContextNoteTool;
