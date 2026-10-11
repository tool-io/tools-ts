import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedStartDate: string;
  readonly observedEndDate: string;
  readonly windowStartDate: string;
  readonly windowEndDate: string;
};
export type Output = { readonly inclusivePersonDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedStartDate: { type: "string", maxLength: 8192 },
    observedEndDate: { type: "string", maxLength: 8192 },
    windowStartDate: { type: "string", maxLength: 8192 },
    windowEndDate: { type: "string", maxLength: 8192 },
  },
  required: [
    "observedStartDate",
    "observedEndDate",
    "windowStartDate",
    "windowEndDate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inclusivePersonDays: { type: "integer" } },
  required: ["inclusivePersonDays"],
} as const;
/** Count inclusive calendar days in the intersection of explicit observation and study windows. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedStartDate, observedEndDate, windowStartDate, windowEndDate } =
    request;
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
      namedDate(observedEndDate, "observedEndDate") >=
        namedDate(observedStartDate, "observedStartDate"),
      "observedEndDate",
    );
    H.domain(
      namedDate(windowEndDate, "windowEndDate") >=
        namedDate(windowStartDate, "windowStartDate"),
      "windowEndDate",
    );
    return {
      inclusivePersonDays: Math.max(
        0,
        (Math.min(
          namedDate(observedEndDate, "observedEndDate").getTime(),
          namedDate(windowEndDate, "windowEndDate").getTime(),
        ) -
          Math.max(
            namedDate(observedStartDate, "observedStartDate").getTime(),
            namedDate(windowStartDate, "windowStartDate").getTime(),
          )) /
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
    observedStartDate: "2026-10-28",
    observedEndDate: "2026-11-05",
    windowStartDate: "2026-11-01",
    windowEndDate: "2026-11-30",
  },
  output: { inclusivePersonDays: 5 },
} satisfies ToolExample<Input, Output>;
export const drugStudyPersonDayContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacoepidemiology", "pharmacy"],
      keywords: ["pharmacoepidemiology", "pharmacy"],
    },
    id: "pharmacoepidemiology/drug-study-person-day-contribution",
    title: "Drug Study Person Day Contribution",
    description:
      "Count inclusive calendar days in the intersection of explicit observation and study windows.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedStartDate: { type: "string", maxLength: 8192 },
        observedEndDate: { type: "string", maxLength: 8192 },
        windowStartDate: { type: "string", maxLength: 8192 },
        windowEndDate: { type: "string", maxLength: 8192 },
      },
      required: [
        "observedStartDate",
        "observedEndDate",
        "windowStartDate",
        "windowEndDate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inclusivePersonDays: { type: "integer" } },
      required: ["inclusivePersonDays"],
    },
    ports: {
      inputs: [
        {
          id: "observedStartDate",
          label: "Observed Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "observedEndDate",
          label: "Observed End Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "windowStartDate",
          label: "Window Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "windowEndDate",
          label: "Window End Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "inclusivePersonDays",
          label: "Inclusive Person Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = drugStudyPersonDayContributionTool.execute;
export default drugStudyPersonDayContributionTool;
