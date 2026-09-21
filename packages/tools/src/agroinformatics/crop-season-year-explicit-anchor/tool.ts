import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly calendarYear: number;
  readonly month: number;
  readonly seasonStartMonth: number;
  readonly labelByEndYear: boolean;
};
export type Output = { readonly seasonYear: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calendarYear: { type: "integer" },
    month: { type: "integer", minimum: 1, maximum: 12 },
    seasonStartMonth: { type: "integer", minimum: 1, maximum: 12 },
    labelByEndYear: { type: "boolean" },
  },
  required: ["calendarYear", "month", "seasonStartMonth", "labelByEndYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { seasonYear: { type: "integer" } },
  required: ["seasonYear"],
} as const;
/** Assign a supplied month to an explicit cross-year season convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { calendarYear, month, seasonStartMonth, labelByEndYear } = request;
  const compute = (): Output => {
    H.integer(month, 1, 12);
    H.integer(seasonStartMonth, 1, 12);
    return {
      seasonYear:
        calendarYear +
        (seasonStartMonth === 1
          ? 0
          : labelByEndYear
            ? month >= seasonStartMonth
              ? 1
              : 0
            : month < seasonStartMonth
              ? -1
              : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    calendarYear: 2026,
    month: 10,
    seasonStartMonth: 9,
    labelByEndYear: false,
  },
  output: { seasonYear: 2026 },
} satisfies ToolExample<Input, Output>;
export const cropSeasonYearExplicitAnchorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/crop-season-year-explicit-anchor",
    title: "Crop Season Year Explicit Anchor Tool",
    description:
      "Assign a supplied month to an explicit cross-year season convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calendarYear: { type: "integer" },
        month: { type: "integer", minimum: 1, maximum: 12 },
        seasonStartMonth: { type: "integer", minimum: 1, maximum: 12 },
        labelByEndYear: { type: "boolean" },
      },
      required: ["calendarYear", "month", "seasonStartMonth", "labelByEndYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { seasonYear: { type: "integer" } },
      required: ["seasonYear"],
    },
    ports: {
      inputs: [
        {
          id: "calendarYear",
          label: "Calendar Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "month",
          label: "Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "seasonStartMonth",
          label: "Season Start Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "labelByEndYear",
          label: "Label By End Year",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "seasonYear",
          label: "Season Year",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropSeasonYearExplicitAnchorTool.execute;
export default cropSeasonYearExplicitAnchorTool;
