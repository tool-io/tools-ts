import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly birthYear: number;
  readonly birthMonth: number;
  readonly retirementAgeYears: number;
};
export type Output = {
  readonly retirementYear: number;
  readonly retirementMonth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthYear: { type: "integer", minimum: 1, maximum: 9999 },
    birthMonth: { type: "integer", minimum: 1, maximum: 12 },
    retirementAgeYears: { type: "integer", minimum: 0, maximum: 9998 },
  },
  required: ["birthYear", "birthMonth", "retirementAgeYears"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retirementYear: { type: "integer" },
    retirementMonth: { type: "integer" },
  },
  required: ["retirementYear", "retirementMonth"],
} as const;
/** Add an explicitly supplied whole-year retirement age to a birth year/month without determining statutory eligibility or a precise retirement day. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthYear, birthMonth, retirementAgeYears } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(birthYear) && birthYear >= 1 && birthYear <= 9999,
      "birthYear",
    ),
      birthYear);
    (H.domain(
      Number.isSafeInteger(birthMonth) && birthMonth >= 1 && birthMonth <= 12,
      "birthMonth",
    ),
      birthMonth);
    (H.domain(
      Number.isSafeInteger(retirementAgeYears) &&
        retirementAgeYears >= 0 &&
        retirementAgeYears <= 9998,
      "retirementAgeYears",
    ),
      retirementAgeYears);
    const retirementYear = birthYear + retirementAgeYears;
    H.domain(retirementYear <= 9999, "retirementAgeYears");
    return { retirementYear, retirementMonth: birthMonth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { birthYear: 1960, birthMonth: 7, retirementAgeYears: 65 },
  output: { retirementYear: 2025, retirementMonth: 7 },
} satisfies ToolExample<Input, Output>;
export const retirementAgeCohortDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["demographic-economics", "demographic economics", "economics"],
      keywords: ["demographic economics", "economics"],
    },
    id: "demographic-economics/retirement-age-cohort-date",
    title: "Retirement Age Cohort Date",
    description:
      "Add an explicitly supplied whole-year retirement age to a birth year/month without determining statutory eligibility or a precise retirement day.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthYear: { type: "integer", minimum: 1, maximum: 9999 },
        birthMonth: { type: "integer", minimum: 1, maximum: 12 },
        retirementAgeYears: { type: "integer", minimum: 0, maximum: 9998 },
      },
      required: ["birthYear", "birthMonth", "retirementAgeYears"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retirementYear: { type: "integer" },
        retirementMonth: { type: "integer" },
      },
      required: ["retirementYear", "retirementMonth"],
    },
    ports: {
      inputs: [
        {
          id: "birthYear",
          label: "Birth Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "birthMonth",
          label: "Birth Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retirementAgeYears",
          label: "Retirement Age Years",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "retirementYear",
          label: "Retirement Year",
          valueType: { type: "integer" },
        },
        {
          id: "retirementMonth",
          label: "Retirement Month",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = retirementAgeCohortDateTool.execute;
export default retirementAgeCohortDateTool;
