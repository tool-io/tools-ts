import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly manuscriptId: string;
  readonly dateTranscription: string;
  readonly suppliedPrecision: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
    dateTranscription: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPrecision: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["manuscriptId", "dateTranscription", "suppliedPrecision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit Islamic manuscript colophon date transcription and precision without converting calendars. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { manuscriptId, dateTranscription, suppliedPrecision } = request;
  const compute = (): Output => {
    H.domain(manuscriptId.length > 0, "manuscriptId");
    H.domain(dateTranscription.length > 0, "dateTranscription");
    H.domain(suppliedPrecision.length > 0, "suppliedPrecision");
    return {
      token: JSON.stringify([
        manuscriptId,
        dateTranscription,
        suppliedPrecision,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    manuscriptId: "MS17",
    dateTranscription: "year text A",
    suppliedPrecision: "year only",
  },
  output: { token: '["MS17","year text A","year only"]' },
} satisfies ToolExample<Input, Output>;
export const islamicManuscriptColophonDatePrecisionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "islamic-studies/islamic-manuscript-colophon-date-precision",
      title: "Islamic Manuscript Colophon Date Precision Tool",
      description:
        "Preserve an explicit Islamic manuscript colophon date transcription and precision without converting calendars.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
          dateTranscription: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedPrecision: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["manuscriptId", "dateTranscription", "suppliedPrecision"],
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
            id: "manuscriptId",
            label: "Manuscript Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "dateTranscription",
            label: "Date Transcription",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedPrecision",
            label: "Supplied Precision",
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
export const run = islamicManuscriptColophonDatePrecisionTool.execute;
export default islamicManuscriptColophonDatePrecisionTool;
