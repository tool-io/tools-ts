import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startDate: string;
  readonly endDateExclusive: string;
  readonly asOfDate: string;
};
export type Output = { readonly active: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startDate: { type: "string", maxLength: 8192 },
    endDateExclusive: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["startDate", "endDateExclusive", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { active: { type: "boolean" } },
  required: ["active"],
} as const;
/** Check an explicitly supplied delegation interval with inclusive start and exclusive end dates without determining legal validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startDate, endDateExclusive, asOfDate } = request;
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
    const a = namedDate(startDate, "startDate").getTime(),
      b = namedDate(endDateExclusive, "endDateExclusive").getTime(),
      t = namedDate(asOfDate, "asOfDate").getTime();
    H.domain(b >= a, "endDateExclusive");
    return { active: t >= a && t < b };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startDate: "2026-01-01",
    endDateExclusive: "2027-01-01",
    asOfDate: "2026-11-01",
  },
  output: { active: true },
} satisfies ToolExample<Input, Output>;
export const delegationStartEndDateCheckTool = H.defineSchemaCalculation<
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
    id: "administrative-science/delegation-start-end-date-check",
    title: "Delegation Start End Date Check",
    description:
      "Check an explicitly supplied delegation interval with inclusive start and exclusive end dates without determining legal validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startDate: { type: "string", maxLength: 8192 },
        endDateExclusive: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["startDate", "endDateExclusive", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { active: { type: "boolean" } },
      required: ["active"],
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
          id: "endDateExclusive",
          label: "End Date Exclusive",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "active", label: "Active", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = delegationStartEndDateCheckTool.execute;
export default delegationStartEndDateCheckTool;
