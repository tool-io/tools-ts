import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interviewId: string;
  readonly rememberedDateText: string;
  readonly documentedDateText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interviewId: { type: "string", maxLength: 8192, minLength: 1 },
    rememberedDateText: { type: "string", maxLength: 8192, minLength: 1 },
    documentedDateText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["interviewId", "rememberedDateText", "documentedDateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicitly remembered and documented date wording without treating memory as a verified date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interviewId, rememberedDateText, documentedDateText } = request;
  const compute = (): Output => {
    H.domain(interviewId.length > 0, "interviewId");
    H.domain(rememberedDateText.length > 0, "rememberedDateText");
    H.domain(documentedDateText.length > 0, "documentedDateText");
    return {
      token: JSON.stringify([
        interviewId,
        rememberedDateText,
        documentedDateText,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    interviewId: "INT17",
    rememberedDateText: "around 1950",
    documentedDateText: "1951-02",
  },
  output: { token: '["INT17","around 1950","1951-02"]' },
} satisfies ToolExample<Input, Output>;
export const oralHistoryRememberedVersusDocumentedDateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["history", "humanities"],
        keywords: ["history", "humanities"],
      },
      id: "history/oral-history-remembered-versus-documented-date",
      title: "Oral History Remembered Versus Documented Date",
      description:
        "Pair explicitly remembered and documented date wording without treating memory as a verified date.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          interviewId: { type: "string", maxLength: 8192, minLength: 1 },
          rememberedDateText: { type: "string", maxLength: 8192, minLength: 1 },
          documentedDateText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["interviewId", "rememberedDateText", "documentedDateText"],
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
            id: "interviewId",
            label: "Interview Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "rememberedDateText",
            label: "Remembered Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "documentedDateText",
            label: "Documented Date Text",
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
export const run = oralHistoryRememberedVersusDocumentedDateTool.execute;
export default oralHistoryRememberedVersusDocumentedDateTool;
