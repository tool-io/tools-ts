import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly deathDateText: string;
  readonly suppliedPrecision: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    deathDateText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPrecision: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "deathDateText", "suppliedPrecision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicitly supplied aging-panel death-date transcription and precision without constructing a date or verifying vital status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, deathDateText, suppliedPrecision } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(deathDateText.length > 0, "deathDateText");
    H.domain(suppliedPrecision.length > 0, "suppliedPrecision");
    return {
      token: JSON.stringify([participantId, deathDateText, suppliedPrecision]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    deathDateText: "2025-10",
    suppliedPrecision: "month",
  },
  output: { token: '["P17","2025-10","month"]' },
} satisfies ToolExample<Input, Output>;
export const agingPanelDeathDatePrecisionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/aging-panel-death-date-precision-code",
    title: "Aging Panel Death Date Precision Code Tool",
    description:
      "Preserve explicitly supplied aging-panel death-date transcription and precision without constructing a date or verifying vital status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        deathDateText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPrecision: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["participantId", "deathDateText", "suppliedPrecision"],
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
          id: "participantId",
          label: "Participant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "deathDateText",
          label: "Death Date Text",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = agingPanelDeathDatePrecisionCodeTool.execute;
export default agingPanelDeathDatePrecisionCodeTool;
