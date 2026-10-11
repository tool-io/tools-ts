import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observanceId: string;
  readonly suppliedWeekdayRule: string;
  readonly calendarSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observanceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedWeekdayRule: { type: "string", maxLength: 8192, minLength: 1 },
    calendarSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observanceId", "suppliedWeekdayRule", "calendarSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit public observance weekday-rule transcription and source without calculating religious dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observanceId, suppliedWeekdayRule, calendarSource } = request;
  const compute = (): Output => {
    H.domain(observanceId.length > 0, "observanceId");
    H.domain(suppliedWeekdayRule.length > 0, "suppliedWeekdayRule");
    H.domain(calendarSource.length > 0, "calendarSource");
    return {
      token: JSON.stringify([
        observanceId,
        suppliedWeekdayRule,
        calendarSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observanceId: "O17",
    suppliedWeekdayRule: "first weekday after date A",
    calendarSource: "Source A",
  },
  output: { token: '["O17","first weekday after date A","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const publicObservanceWeekdayRuleTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["religious-studies", "religious studies", "humanities"],
      keywords: ["religious studies", "humanities"],
    },
    id: "religious-studies/public-observance-weekday-rule-token",
    title: "Public Observance Weekday Rule Token",
    description:
      "Preserve an explicit public observance weekday-rule transcription and source without calculating religious dates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observanceId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedWeekdayRule: { type: "string", maxLength: 8192, minLength: 1 },
        calendarSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observanceId", "suppliedWeekdayRule", "calendarSource"],
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
          id: "observanceId",
          label: "Observance Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedWeekdayRule",
          label: "Supplied Weekday Rule",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "calendarSource",
          label: "Calendar Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicObservanceWeekdayRuleTokenTool.execute;
export default publicObservanceWeekdayRuleTokenTool;
