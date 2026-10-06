import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionId: string;
  readonly shiftCode: string;
  readonly fatigueText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionId: { type: "string", maxLength: 8192, minLength: 1 },
    shiftCode: { type: "string", maxLength: 8192, minLength: 1 },
    fatigueText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sessionId", "shiftCode", "fatigueText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a study-session work-shift and self-reported fatigue text without interpreting a clinical scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionId, shiftCode, fatigueText } = request;
  const compute = (): Output => {
    H.domain(sessionId.length > 0, "sessionId");
    H.domain(shiftCode.length > 0, "shiftCode");
    H.domain(fatigueText.length > 0, "fatigueText");
    return { token: JSON.stringify([sessionId, shiftCode, fatigueText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sessionId: "S17", shiftCode: "evening", fatigueText: "moderate" },
  output: { token: '["S17","evening","moderate"]' },
} satisfies ToolExample<Input, Output>;
export const studySessionShiftFatigueSelfReportTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/study-session-shift-fatigue-self-report",
    title: "Study Session Shift Fatigue Self Report",
    description:
      "Preserve a study-session work-shift and self-reported fatigue text without interpreting a clinical scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionId: { type: "string", maxLength: 8192, minLength: 1 },
        shiftCode: { type: "string", maxLength: 8192, minLength: 1 },
        fatigueText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sessionId", "shiftCode", "fatigueText"],
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
          id: "sessionId",
          label: "Session Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "shiftCode",
          label: "Shift Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fatigueText",
          label: "Fatigue Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = studySessionShiftFatigueSelfReportTool.execute;
export default studySessionShiftFatigueSelfReportTool;
