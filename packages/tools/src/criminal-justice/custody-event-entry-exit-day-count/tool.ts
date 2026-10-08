import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryDate: string;
  readonly exitDate: string;
  readonly countBothDates: boolean;
};
export type Output = {
  readonly elapsedDays: number;
  readonly countedDates: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryDate: { type: "string", maxLength: 8192 },
    exitDate: { type: "string", maxLength: 8192 },
    countBothDates: { type: "boolean" },
  },
  required: ["entryDate", "exitDate", "countBothDates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "integer" },
    countedDates: { type: "integer" },
  },
  required: ["elapsedDays", "countedDates"],
} as const;
/** Count an explicitly recorded custody-date interval under a supplied endpoint convention without calculating a sentence or credit entitlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryDate, exitDate, countBothDates } = request;
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
    const a = namedDate(entryDate, "entryDate").getTime(),
      b = namedDate(exitDate, "exitDate").getTime();
    H.domain(b >= a, "exitDate");
    const elapsedDays = (b - a) / 86400000;
    return {
      elapsedDays,
      countedDates: elapsedDays + (countBothDates ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entryDate: "2026-11-01",
    exitDate: "2026-11-04",
    countBothDates: true,
  },
  output: { elapsedDays: 3, countedDates: 4 },
} satisfies ToolExample<Input, Output>;
export const custodyEventEntryExitDayCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/custody-event-entry-exit-day-count",
    title: "Custody Event Entry Exit Day Count",
    description:
      "Count an explicitly recorded custody-date interval under a supplied endpoint convention without calculating a sentence or credit entitlement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryDate: { type: "string", maxLength: 8192 },
        exitDate: { type: "string", maxLength: 8192 },
        countBothDates: { type: "boolean" },
      },
      required: ["entryDate", "exitDate", "countBothDates"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDays: { type: "integer" },
        countedDates: { type: "integer" },
      },
      required: ["elapsedDays", "countedDates"],
    },
    ports: {
      inputs: [
        {
          id: "entryDate",
          label: "Entry Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exitDate",
          label: "Exit Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "countBothDates",
          label: "Count Both Dates",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          valueType: { type: "integer" },
        },
        {
          id: "countedDates",
          label: "Counted Dates",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = custodyEventEntryExitDayCountTool.execute;
export default custodyEventEntryExitDayCountTool;
