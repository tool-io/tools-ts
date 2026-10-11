import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly detectedDate: string;
  readonly closedDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    detectedDate: { type: "string", maxLength: 8192 },
    closedDate: { type: "string", maxLength: 8192 },
  },
  required: ["detectedDate", "closedDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days from a recorded deviation detection to closure without deciding closure adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { detectedDate, closedDate } = request;
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
      signedCalendarDays:
        (namedDate(closedDate, "closedDate").getTime() -
          namedDate(detectedDate, "detectedDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { detectedDate: "2026-10-28", closedDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const deviationDetectionClosureGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-assurance",
        "quality assurance",
        "research and quality management",
      ],
      keywords: ["quality assurance", "research and quality management"],
    },
    id: "quality-assurance/deviation-detection-closure-gap",
    title: "Deviation Detection Closure Gap",
    description:
      "Count signed calendar days from a recorded deviation detection to closure without deciding closure adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        detectedDate: { type: "string", maxLength: 8192 },
        closedDate: { type: "string", maxLength: 8192 },
      },
      required: ["detectedDate", "closedDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "number" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "detectedDate",
          label: "Detected Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "closedDate",
          label: "Closed Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = deviationDetectionClosureGapTool.execute;
export default deviationDetectionClosureGapTool;
