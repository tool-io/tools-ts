import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly suppliedNumberText: string;
  readonly formatNote: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedNumberText: { type: "string", maxLength: 8192, minLength: 1 },
    formatNote: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "suppliedNumberText", "formatNote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a local numeric transcription and explicit formatting note without guessing or coercing a number. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, suppliedNumberText, formatNote } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(suppliedNumberText.length > 0, "suppliedNumberText");
    H.domain(formatNote.length > 0, "formatNote");
    return {
      token: JSON.stringify([sourceId, suppliedNumberText, formatNote]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceId: "S17",
    suppliedNumberText: "1.234,5",
    formatNote: "dot grouping, comma decimal",
  },
  output: { token: '["S17","1.234,5","dot grouping, comma decimal"]' },
} satisfies ToolExample<Input, Output>;
export const areaStudyLocalNumberFormatTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/area-study-local-number-format-token",
    title: "Area Study Local Number Format Token",
    description:
      "Preserve a local numeric transcription and explicit formatting note without guessing or coercing a number.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedNumberText: { type: "string", maxLength: 8192, minLength: 1 },
        formatNote: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceId", "suppliedNumberText", "formatNote"],
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
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedNumberText",
          label: "Supplied Number Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "formatNote",
          label: "Format Note",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = areaStudyLocalNumberFormatTokenTool.execute;
export default areaStudyLocalNumberFormatTokenTool;
