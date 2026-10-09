import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly queryOpenedDate: string;
  readonly queryClosedDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queryOpenedDate: { type: "string", maxLength: 8192 },
    queryClosedDate: { type: "string", maxLength: 8192 },
  },
  required: ["queryOpenedDate", "queryClosedDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days between explicit query opening and closure dates without assessing data quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { queryOpenedDate, queryClosedDate } = request;
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
        (namedDate(queryClosedDate, "queryClosedDate").getTime() -
          namedDate(queryOpenedDate, "queryOpenedDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { queryOpenedDate: "2026-10-28", queryClosedDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const gcpQueryClosureDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gcp",
        "good clinical practice",
        "research and quality management",
      ],
      keywords: [
        "good clinical practice",
        "research and quality management",
        "GCP",
      ],
    },
    id: "gcp/gcp-query-closure-delay",
    title: "GCP Query Closure Delay",
    description:
      "Count signed calendar days between explicit query opening and closure dates without assessing data quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        queryOpenedDate: { type: "string", maxLength: 8192 },
        queryClosedDate: { type: "string", maxLength: 8192 },
      },
      required: ["queryOpenedDate", "queryClosedDate"],
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
          id: "queryOpenedDate",
          label: "Query Opened Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "queryClosedDate",
          label: "Query Closed Date",
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
export const run = gcpQueryClosureDelayTool.execute;
export default gcpQueryClosureDelayTool;
