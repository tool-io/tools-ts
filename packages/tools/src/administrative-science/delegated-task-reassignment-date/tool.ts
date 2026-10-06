import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalAssignmentDate: string;
  readonly reassignmentDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalAssignmentDate: { type: "string", maxLength: 8192 },
    reassignmentDate: { type: "string", maxLength: 8192 },
  },
  required: ["originalAssignmentDate", "reassignmentDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Measure signed calendar days from original task assignment to an explicit reassignment date without business-day rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalAssignmentDate, reassignmentDate } = request;
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
        (namedDate(reassignmentDate, "reassignmentDate").getTime() -
          namedDate(
            originalAssignmentDate,
            "originalAssignmentDate",
          ).getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalAssignmentDate: "2026-10-28",
    reassignmentDate: "2026-11-01",
  },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const delegatedTaskReassignmentDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/delegated-task-reassignment-date",
    title: "Delegated Task Reassignment Date",
    description:
      "Measure signed calendar days from original task assignment to an explicit reassignment date without business-day rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalAssignmentDate: { type: "string", maxLength: 8192 },
        reassignmentDate: { type: "string", maxLength: 8192 },
      },
      required: ["originalAssignmentDate", "reassignmentDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "integer" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "originalAssignmentDate",
          label: "Original Assignment Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reassignmentDate",
          label: "Reassignment Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = delegatedTaskReassignmentDateTool.execute;
export default delegatedTaskReassignmentDateTool;
