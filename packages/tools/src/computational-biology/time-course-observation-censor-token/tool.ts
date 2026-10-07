import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seriesId: string;
  readonly timeText: string;
  readonly suppliedCensorCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seriesId: { type: "string", maxLength: 8192, minLength: 1 },
    timeText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCensorCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["seriesId", "timeText", "suppliedCensorCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit biological time-course censoring metadata without imputing values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seriesId, timeText, suppliedCensorCode } = request;
  const compute = (): Output => {
    H.domain(seriesId.length > 0, "seriesId");
    H.domain(timeText.length > 0, "timeText");
    H.domain(suppliedCensorCode.length > 0, "suppliedCensorCode");
    return { token: JSON.stringify([seriesId, timeText, suppliedCensorCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    seriesId: "S17",
    timeText: "12 min",
    suppliedCensorCode: "left-censored",
  },
  output: { token: '["S17","12 min","left-censored"]' },
} satisfies ToolExample<Input, Output>;
export const timeCourseObservationCensorTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-biology", "computational biology", "biology"],
      keywords: ["computational biology", "biology"],
    },
    id: "computational-biology/time-course-observation-censor-token",
    title: "Time Course Observation Censor Token",
    description:
      "Preserve explicit biological time-course censoring metadata without imputing values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seriesId: { type: "string", maxLength: 8192, minLength: 1 },
        timeText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCensorCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["seriesId", "timeText", "suppliedCensorCode"],
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
          id: "seriesId",
          label: "Series Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "timeText",
          label: "Time Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCensorCode",
          label: "Supplied Censor Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = timeCourseObservationCensorTokenTool.execute;
export default timeCourseObservationCensorTokenTool;
