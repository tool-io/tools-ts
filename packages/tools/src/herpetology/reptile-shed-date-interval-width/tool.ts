import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestDate: string;
  readonly latestDate: string;
};
export type Output = { readonly intervalDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestDate: { type: "string", maxLength: 8192 },
    latestDate: { type: "string", maxLength: 8192 },
  },
  required: ["earliestDate", "latestDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intervalDays: { type: "integer" } },
  required: ["intervalDays"],
} as const;
/** Measure the date-only width of an explicit ordered reptile-shedding observation bracket without inferring a shedding date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestDate, latestDate } = request;
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
    H.domain(
      namedDate(latestDate, "latestDate").getTime() >=
        namedDate(earliestDate, "earliestDate").getTime(),
      "latestDate",
    );
    return {
      intervalDays:
        (namedDate(latestDate, "latestDate").getTime() -
          namedDate(earliestDate, "earliestDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestDate: "2026-10-28", latestDate: "2026-11-01" },
  output: { intervalDays: 4 },
} satisfies ToolExample<Input, Output>;
export const reptileShedDateIntervalWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/reptile-shed-date-interval-width",
    title: "Reptile Shed Date Interval Width Tool",
    description:
      "Measure the date-only width of an explicit ordered reptile-shedding observation bracket without inferring a shedding date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestDate: { type: "string", maxLength: 8192 },
        latestDate: { type: "string", maxLength: 8192 },
      },
      required: ["earliestDate", "latestDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { intervalDays: { type: "integer" } },
      required: ["intervalDays"],
    },
    ports: {
      inputs: [
        {
          id: "earliestDate",
          label: "Earliest Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "latestDate",
          label: "Latest Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "intervalDays",
          label: "Interval Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = reptileShedDateIntervalWidthTool.execute;
export default reptileShedDateIntervalWidthTool;
