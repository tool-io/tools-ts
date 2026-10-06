import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly startDate: string; readonly offsetDays: number };
export type Output = { readonly deadlineDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startDate: { type: "string", maxLength: 8192 },
    offsetDays: { type: "integer", minimum: 0, maximum: 3652424 },
  },
  required: ["startDate", "offsetDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { deadlineDate: { type: "string", maxLength: 8192 } },
  required: ["deadlineDate"],
} as const;
/** Add an explicit calendar-day learning-contract interval to a start date, with the start day as offset zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startDate, offsetDays } = request;
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
    (H.domain(
      Number.isSafeInteger(offsetDays) &&
        offsetDays >= 0 &&
        offsetDays <= 3652424,
      "offsetDays",
    ),
      offsetDays);
    const d = namedDate(startDate, "startDate");
    d.setUTCDate(d.getUTCDate() + offsetDays);
    H.domain(d.getUTCFullYear() <= 9999, "offsetDays");
    return { deadlineDate: d.toISOString().slice(0, 10) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startDate: "2026-11-01", offsetDays: 14 },
  output: { deadlineDate: "2026-11-15" },
} satisfies ToolExample<Input, Output>;
export const learningContractDeadlineOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/learning-contract-deadline-offset",
    title: "Learning Contract Deadline Offset",
    description:
      "Add an explicit calendar-day learning-contract interval to a start date, with the start day as offset zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startDate: { type: "string", maxLength: 8192 },
        offsetDays: { type: "integer", minimum: 0, maximum: 3652424 },
      },
      required: ["startDate", "offsetDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { deadlineDate: { type: "string", maxLength: 8192 } },
      required: ["deadlineDate"],
    },
    ports: {
      inputs: [
        {
          id: "startDate",
          label: "Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "offsetDays",
          label: "Offset Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "deadlineDate",
          label: "Deadline Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = learningContractDeadlineOffsetTool.execute;
export default learningContractDeadlineOffsetTool;
