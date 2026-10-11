import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asOfDate: string;
  readonly suppliedDeadlineDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asOfDate: { type: "string", maxLength: 8192 },
    suppliedDeadlineDate: { type: "string", maxLength: 8192 },
  },
  required: ["asOfDate", "suppliedDeadlineDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days until an explicit regulatory commitment deadline without choosing a deadline or calendar convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asOfDate, suppliedDeadlineDate } = request;
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
        (namedDate(suppliedDeadlineDate, "suppliedDeadlineDate").getTime() -
          namedDate(asOfDate, "asOfDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { asOfDate: "2026-10-28", suppliedDeadlineDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const regulatoryCommitmentDeadlineMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "regulatory-affairs",
        "regulatory affairs",
        "research and quality management",
      ],
      keywords: ["regulatory affairs", "research and quality management"],
    },
    id: "regulatory-affairs/regulatory-commitment-deadline-margin",
    title: "Regulatory Commitment Deadline Margin",
    description:
      "Count signed calendar days until an explicit regulatory commitment deadline without choosing a deadline or calendar convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asOfDate: { type: "string", maxLength: 8192 },
        suppliedDeadlineDate: { type: "string", maxLength: 8192 },
      },
      required: ["asOfDate", "suppliedDeadlineDate"],
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
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedDeadlineDate",
          label: "Supplied Deadline Date",
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
export const run = regulatoryCommitmentDeadlineMarginTool.execute;
export default regulatoryCommitmentDeadlineMarginTool;
