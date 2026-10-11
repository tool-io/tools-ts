import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earlierCoverageEndDate: string;
  readonly nextSupplyStartDate: string;
};
export type Output = { readonly overlapDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earlierCoverageEndDate: { type: "string", maxLength: 8192 },
    nextSupplyStartDate: { type: "string", maxLength: 8192 },
  },
  required: ["earlierCoverageEndDate", "nextSupplyStartDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlapDays: { type: "integer" } },
  required: ["overlapDays"],
} as const;
/** Count inclusive calendar-day overlap between explicit earlier coverage end and next supply start without assuming consumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earlierCoverageEndDate, nextSupplyStartDate } = request;
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
      overlapDays: Math.max(
        0,
        (namedDate(earlierCoverageEndDate, "earlierCoverageEndDate").getTime() -
          namedDate(nextSupplyStartDate, "nextSupplyStartDate").getTime()) /
          86400000 +
          1,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    earlierCoverageEndDate: "2026-11-05",
    nextSupplyStartDate: "2026-11-03",
  },
  output: { overlapDays: 3 },
} satisfies ToolExample<Input, Output>;
export const refillOverlapDaysTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacoepidemiology", "pharmacy"],
      keywords: ["pharmacoepidemiology", "pharmacy"],
    },
    id: "pharmacoepidemiology/refill-overlap-days",
    title: "Refill Overlap Days",
    description:
      "Count inclusive calendar-day overlap between explicit earlier coverage end and next supply start without assuming consumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earlierCoverageEndDate: { type: "string", maxLength: 8192 },
        nextSupplyStartDate: { type: "string", maxLength: 8192 },
      },
      required: ["earlierCoverageEndDate", "nextSupplyStartDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlapDays: { type: "integer" } },
      required: ["overlapDays"],
    },
    ports: {
      inputs: [
        {
          id: "earlierCoverageEndDate",
          label: "Earlier Coverage End Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nextSupplyStartDate",
          label: "Next Supply Start Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "overlapDays",
          label: "Overlap Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = refillOverlapDaysTool.execute;
export default refillOverlapDaysTool;
