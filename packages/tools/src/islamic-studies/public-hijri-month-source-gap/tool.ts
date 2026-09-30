import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMonth: number;
  readonly secondMonth: number;
  readonly firstYear: number;
  readonly secondYear: number;
  readonly monthsInSuppliedYear: number;
};
export type Output = { readonly monthGapDecimal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMonth: { type: "integer", minimum: 1 },
    secondMonth: { type: "integer", minimum: 1 },
    firstYear: { type: "integer" },
    secondYear: { type: "integer" },
    monthsInSuppliedYear: { type: "integer", minimum: 1 },
  },
  required: [
    "firstMonth",
    "secondMonth",
    "firstYear",
    "secondYear",
    "monthsInSuppliedYear",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    monthGapDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["monthGapDecimal"],
} as const;
/** Compare explicit year/month labels on a supplied uniform month radix; no Gregorian conversion or lunar observation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstMonth,
    secondMonth,
    firstYear,
    secondYear,
    monthsInSuppliedYear,
  } = request;
  const compute = (): Output => {
    H.integer(monthsInSuppliedYear, 1);
    H.integer(firstMonth, 1, monthsInSuppliedYear);
    H.integer(secondMonth, 1, monthsInSuppliedYear);
    return {
      monthGapDecimal: (
        (BigInt(secondYear) - BigInt(firstYear)) *
          BigInt(monthsInSuppliedYear) +
        BigInt(secondMonth) -
        BigInt(firstMonth)
      ).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstMonth: 11,
    secondMonth: 2,
    firstYear: 1445,
    secondYear: 1446,
    monthsInSuppliedYear: 12,
  },
  output: { monthGapDecimal: "3" },
} satisfies ToolExample<Input, Output>;
export const publicHijriMonthSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/public-hijri-month-source-gap",
    title: "Public Hijri Month Source Gap Tool",
    description:
      "Compare explicit year/month labels on a supplied uniform month radix; no Gregorian conversion or lunar observation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMonth: { type: "integer", minimum: 1 },
        secondMonth: { type: "integer", minimum: 1 },
        firstYear: { type: "integer" },
        secondYear: { type: "integer" },
        monthsInSuppliedYear: { type: "integer", minimum: 1 },
      },
      required: [
        "firstMonth",
        "secondMonth",
        "firstYear",
        "secondYear",
        "monthsInSuppliedYear",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        monthGapDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["monthGapDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "firstMonth",
          label: "First Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondMonth",
          label: "Second Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstYear",
          label: "First Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondYear",
          label: "Second Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "monthsInSuppliedYear",
          label: "Months In Supplied Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "monthGapDecimal",
          label: "Month Gap Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicHijriMonthSourceGapTool.execute;
export default publicHijriMonthSourceGapTool;
