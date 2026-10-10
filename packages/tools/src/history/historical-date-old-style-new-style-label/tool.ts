import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedDateText: string;
  readonly suppliedStyle: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDateText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedStyle: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedDateText", "suppliedStyle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit historical date transcription by supplied calendar-style wording without converting calendars. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedDateText, suppliedStyle } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedDateText.length > 0, "suppliedDateText");
    H.domain(suppliedStyle.length > 0, "suppliedStyle");
    return {
      token: JSON.stringify([recordId, suppliedDateText, suppliedStyle]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedDateText: "10 March 1700",
    suppliedStyle: "old style",
  },
  output: { token: '["R17","10 March 1700","old style"]' },
} satisfies ToolExample<Input, Output>;
export const historicalDateOldStyleNewStyleLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["history", "humanities"],
        keywords: ["history", "humanities"],
      },
      id: "history/historical-date-old-style-new-style-label",
      title: "Historical Date Old Style New Style Label",
      description:
        "Qualify an explicit historical date transcription by supplied calendar-style wording without converting calendars.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedDateText: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedStyle: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedDateText", "suppliedStyle"],
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
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedDateText",
            label: "Supplied Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedStyle",
            label: "Supplied Style",
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
export const run = historicalDateOldStyleNewStyleLabelTool.execute;
export default historicalDateOldStyleNewStyleLabelTool;
