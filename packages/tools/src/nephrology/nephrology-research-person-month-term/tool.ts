import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personMonthExposures: readonly number[];
  readonly events: number;
  readonly monthsPerYear: number;
};
export type Output = {
  readonly totalPersonMonths: number;
  readonly personYears: number;
  readonly eventsPerPersonYear: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personMonthExposures: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    events: { type: "integer", minimum: 0 },
    monthsPerYear: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["personMonthExposures", "events", "monthsPerYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPersonMonths: { type: "number" },
    personYears: { type: "number" },
    eventsPerPersonYear: { type: "number" },
  },
  required: ["totalPersonMonths", "personYears", "eventsPerPersonYear"],
} as const;
/** Calculate nephrology research person month term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personMonthExposures, events, monthsPerYear } = request;
  const compute = (): Output => {
    H.domain(
      personMonthExposures.every((x) => x >= 0) &&
        personMonthExposures.reduce((a, b) => a + b, 0) > 0,
    );
    H.integer(events, 0);
    H.positive(monthsPerYear);
    return {
      totalPersonMonths: personMonthExposures.reduce((a, b) => a + b, 0),
      personYears:
        personMonthExposures.reduce((a, b) => a + b, 0) / monthsPerYear,
      eventsPerPersonYear:
        (events * monthsPerYear) /
        personMonthExposures.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { personMonthExposures: [12, 6, 6], events: 2, monthsPerYear: 12 },
  output: { totalPersonMonths: 24, personYears: 2, eventsPerPersonYear: 1 },
} satisfies ToolExample<Input, Output>;
export const nephrologyResearchPersonMonthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/nephrology-research-person-month-term",
    title: "Nephrology Research Person Month Term Tool",
    description:
      "Calculate nephrology research person month term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personMonthExposures: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        events: { type: "integer", minimum: 0 },
        monthsPerYear: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["personMonthExposures", "events", "monthsPerYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalPersonMonths: { type: "number" },
        personYears: { type: "number" },
        eventsPerPersonYear: { type: "number" },
      },
      required: ["totalPersonMonths", "personYears", "eventsPerPersonYear"],
    },
    ports: {
      inputs: [
        {
          id: "personMonthExposures",
          label: "Person Month Exposures",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "events",
          label: "Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "monthsPerYear",
          label: "Months Per Year",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalPersonMonths",
          label: "Total Person Months",
          valueType: { type: "number" },
        },
        {
          id: "personYears",
          label: "Person Years",
          valueType: { type: "number" },
        },
        {
          id: "eventsPerPersonYear",
          label: "Events Per Person Year",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nephrologyResearchPersonMonthTermTool.execute;
export default nephrologyResearchPersonMonthTermTool;
