import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly receivedDate: string;
  readonly asOfDate: string;
};
export type Output = { readonly ageDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    receivedDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["receivedDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ageDays: { type: "integer" } },
  required: ["ageDays"],
} as const;
/** Compute a pending case's calendar age on an explicit as-of date, without applying service deadlines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { receivedDate, asOfDate } = request;
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
    const a = namedDate(receivedDate, "receivedDate").getTime(),
      b = namedDate(asOfDate, "asOfDate").getTime();
    H.domain(b >= a, "");
    return { ageDays: (b - a) / 86400000 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { receivedDate: "2026-10-01", asOfDate: "2026-11-01" },
  output: { ageDays: 31 },
} satisfies ToolExample<Input, Output>;
export const caseBacklogAgeAtDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/case-backlog-age-at-date",
    title: "Case Backlog Age At Date Tool",
    description:
      "Compute a pending case's calendar age on an explicit as-of date, without applying service deadlines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        receivedDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["receivedDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ageDays: { type: "integer" } },
      required: ["ageDays"],
    },
    ports: {
      inputs: [
        {
          id: "receivedDate",
          label: "Received Date",
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
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = caseBacklogAgeAtDateTool.execute;
export default caseBacklogAgeAtDateTool;
