import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cycleStartDate: string;
  readonly observationDate: string;
};
export type Output = {
  readonly oneBasedDay: number;
  readonly beforeCycleStart: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleStartDate: { type: "string", maxLength: 8192 },
    observationDate: { type: "string", maxLength: 8192 },
  },
  required: ["cycleStartDate", "observationDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneBasedDay: { type: "integer" },
    beforeCycleStart: { type: "boolean" },
  },
  required: ["oneBasedDay", "beforeCycleStart"],
} as const;
/** Index an explicit observation date from a supplied cycle-start date without predicting ovulation or cycle length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cycleStartDate, observationDate } = request;
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
    return (() => {
      const days =
        (namedDate(observationDate, "observationDate").getTime() -
          namedDate(cycleStartDate, "cycleStartDate").getTime()) /
        86400000;
      return { oneBasedDay: days + 1, beforeCycleStart: days < 0 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cycleStartDate: "2026-10-01", observationDate: "2026-10-05" },
  output: { oneBasedDay: 5, beforeCycleStart: false },
} satisfies ToolExample<Input, Output>;
export const menstrualCycleDayIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gynecology", "health and medicine"],
      keywords: ["gynecology", "health and medicine"],
    },
    id: "gynecology/menstrual-cycle-day-index",
    title: "Menstrual Cycle Day Index",
    description:
      "Index an explicit observation date from a supplied cycle-start date without predicting ovulation or cycle length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleStartDate: { type: "string", maxLength: 8192 },
        observationDate: { type: "string", maxLength: 8192 },
      },
      required: ["cycleStartDate", "observationDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oneBasedDay: { type: "integer" },
        beforeCycleStart: { type: "boolean" },
      },
      required: ["oneBasedDay", "beforeCycleStart"],
    },
    ports: {
      inputs: [
        {
          id: "cycleStartDate",
          label: "Cycle Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "observationDate",
          label: "Observation Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "oneBasedDay",
          label: "One Based Day",
          valueType: { type: "integer" },
        },
        {
          id: "beforeCycleStart",
          label: "Before Cycle Start",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = menstrualCycleDayIndexTool.execute;
export default menstrualCycleDayIndexTool;
