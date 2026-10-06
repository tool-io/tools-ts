import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestDate: string;
  readonly latestDate: string;
};
export type Output = {
  readonly uncertaintySpanDays: number;
  readonly exactDate: boolean;
};
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
  properties: {
    uncertaintySpanDays: { type: "integer" },
    exactDate: { type: "boolean" },
  },
  required: ["uncertaintySpanDays", "exactDate"],
} as const;
/** Measure a supplied provenance transaction-date uncertainty interval without imputing a transaction date. */
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
      namedDate(latestDate, "latestDate") >=
        namedDate(earliestDate, "earliestDate"),
      "latestDate",
    );
    return {
      uncertaintySpanDays:
        (namedDate(latestDate, "latestDate").getTime() -
          namedDate(earliestDate, "earliestDate").getTime()) /
        86400000,
      exactDate: earliestDate === latestDate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestDate: "2026-10-28", latestDate: "2026-11-01" },
  output: { uncertaintySpanDays: 4, exactDate: false },
} satisfies ToolExample<Input, Output>;
export const provenanceTransactionDateUncertaintyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["art-history", "art history", "arts and design"],
        keywords: ["art history", "arts and design"],
      },
      id: "art-history/provenance-transaction-date-uncertainty",
      title: "Provenance Transaction Date Uncertainty",
      description:
        "Measure a supplied provenance transaction-date uncertainty interval without imputing a transaction date.",
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
        properties: {
          uncertaintySpanDays: { type: "integer" },
          exactDate: { type: "boolean" },
        },
        required: ["uncertaintySpanDays", "exactDate"],
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
            id: "uncertaintySpanDays",
            label: "Uncertainty Span Days",
            valueType: { type: "integer" },
          },
          {
            id: "exactDate",
            label: "Exact Date",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = provenanceTransactionDateUncertaintyTool.execute;
export default provenanceTransactionDateUncertaintyTool;
