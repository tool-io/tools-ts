import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalDate: string;
  readonly continuedDate: string;
};
export type Output = { readonly delayDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalDate: { type: "string", maxLength: 8192 },
    continuedDate: { type: "string", maxLength: 8192 },
  },
  required: ["originalDate", "continuedDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delayDays: { type: "integer" } },
  required: ["delayDays"],
} as const;
/** Describe a signed calendar-day hearing-date change without determining legal deadlines or reasons for continuance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalDate, continuedDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    return {
      delayDays:
        (namedDate(continuedDate, "continuedDate").getTime() -
          namedDate(originalDate, "originalDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalDate: "2026-11-01", continuedDate: "2026-11-15" },
  output: { delayDays: 14 },
} satisfies ToolExample<Input, Output>;
export const hearingContinuanceSingleDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/hearing-continuance-single-delay",
    title: "Hearing Continuance Single Delay",
    description:
      "Describe a signed calendar-day hearing-date change without determining legal deadlines or reasons for continuance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalDate: { type: "string", maxLength: 8192 },
        continuedDate: { type: "string", maxLength: 8192 },
      },
      required: ["originalDate", "continuedDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delayDays: { type: "integer" } },
      required: ["delayDays"],
    },
    ports: {
      inputs: [
        {
          id: "originalDate",
          label: "Original Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "continuedDate",
          label: "Continued Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "delayDays",
          label: "Delay Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = hearingContinuanceSingleDelayTool.execute;
export default hearingContinuanceSingleDelayTool;
