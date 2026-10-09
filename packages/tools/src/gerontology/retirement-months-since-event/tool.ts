import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retirementYear: number;
  readonly retirementMonth: number;
  readonly asOfYear: number;
  readonly asOfMonth: number;
};
export type Output = { readonly signedCalendarMonthOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retirementYear: { type: "integer", minimum: 1, maximum: 9999 },
    retirementMonth: { type: "integer", minimum: 1, maximum: 12 },
    asOfYear: { type: "integer", minimum: 1, maximum: 9999 },
    asOfMonth: { type: "integer", minimum: 1, maximum: 12 },
  },
  required: ["retirementYear", "retirementMonth", "asOfYear", "asOfMonth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarMonthOffset: { type: "integer" } },
  required: ["signedCalendarMonthOffset"],
} as const;
/** Count signed year-month boundaries since an explicit retirement month without treating partial months as completed durations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retirementYear, retirementMonth, asOfYear, asOfMonth } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(retirementYear) &&
        retirementYear >= 1 &&
        retirementYear <= 9999,
      "retirementYear",
    ),
      retirementYear);
    (H.domain(
      Number.isSafeInteger(asOfYear) && asOfYear >= 1 && asOfYear <= 9999,
      "asOfYear",
    ),
      asOfYear);
    (H.domain(
      Number.isSafeInteger(retirementMonth) &&
        retirementMonth >= 1 &&
        retirementMonth <= 12,
      "retirementMonth",
    ),
      retirementMonth);
    (H.domain(
      Number.isSafeInteger(asOfMonth) && asOfMonth >= 1 && asOfMonth <= 12,
      "asOfMonth",
    ),
      asOfMonth);
    return {
      signedCalendarMonthOffset:
        12 * (asOfYear - retirementYear) + asOfMonth - retirementMonth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    retirementYear: 2020,
    retirementMonth: 7,
    asOfYear: 2026,
    asOfMonth: 11,
  },
  output: { signedCalendarMonthOffset: 76 },
} satisfies ToolExample<Input, Output>;
export const retirementMonthsSinceEventTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gerontology", "health and medicine"],
      keywords: ["gerontology", "health and medicine"],
    },
    id: "gerontology/retirement-months-since-event",
    title: "Retirement Months Since Event",
    description:
      "Count signed year-month boundaries since an explicit retirement month without treating partial months as completed durations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retirementYear: { type: "integer", minimum: 1, maximum: 9999 },
        retirementMonth: { type: "integer", minimum: 1, maximum: 12 },
        asOfYear: { type: "integer", minimum: 1, maximum: 9999 },
        asOfMonth: { type: "integer", minimum: 1, maximum: 12 },
      },
      required: ["retirementYear", "retirementMonth", "asOfYear", "asOfMonth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarMonthOffset: { type: "integer" } },
      required: ["signedCalendarMonthOffset"],
    },
    ports: {
      inputs: [
        {
          id: "retirementYear",
          label: "Retirement Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retirementMonth",
          label: "Retirement Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "asOfYear",
          label: "As Of Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "asOfMonth",
          label: "As Of Month",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarMonthOffset",
          label: "Signed Calendar Month Offset",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = retirementMonthsSinceEventTool.execute;
export default retirementMonthsSinceEventTool;
