import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventYear: number;
  readonly declaredRetirementYear: number;
  readonly cohortOriginYear: number;
};
export type Output = {
  readonly fromRetirementDecimal: string;
  readonly retirementFromCohortDecimal: string;
  readonly eventFromCohortDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventYear: { type: "integer" },
    declaredRetirementYear: { type: "integer" },
    cohortOriginYear: { type: "integer" },
  },
  required: ["eventYear", "declaredRetirementYear", "cohortOriginYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fromRetirementDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    retirementFromCohortDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    eventFromCohortDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: [
    "fromRetirementDecimal",
    "retirementFromCohortDecimal",
    "eventFromCohortDecimal",
  ],
} as const;
/** Compare supplied public or research year origins without selecting a retirement-age rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventYear, declaredRetirementYear, cohortOriginYear } = request;
  const compute = (): Output => {
    return {
      fromRetirementDecimal: (
        BigInt(eventYear) - BigInt(declaredRetirementYear)
      ).toString(),
      retirementFromCohortDecimal: (
        BigInt(declaredRetirementYear) - BigInt(cohortOriginYear)
      ).toString(),
      eventFromCohortDecimal: (
        BigInt(eventYear) - BigInt(cohortOriginYear)
      ).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventYear: 2020,
    declaredRetirementYear: 2010,
    cohortOriginYear: 1950,
  },
  output: {
    fromRetirementDecimal: "10",
    retirementFromCohortDecimal: "60",
    eventFromCohortDecimal: "70",
  },
} satisfies ToolExample<Input, Output>;
export const retirementEventOriginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/retirement-event-origin-gap",
    title: "Retirement Event Origin Gap Tool",
    description:
      "Compare supplied public or research year origins without selecting a retirement-age rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventYear: { type: "integer" },
        declaredRetirementYear: { type: "integer" },
        cohortOriginYear: { type: "integer" },
      },
      required: ["eventYear", "declaredRetirementYear", "cohortOriginYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fromRetirementDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        retirementFromCohortDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        eventFromCohortDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: [
        "fromRetirementDecimal",
        "retirementFromCohortDecimal",
        "eventFromCohortDecimal",
      ],
    },
    ports: {
      inputs: [
        {
          id: "eventYear",
          label: "Event Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "declaredRetirementYear",
          label: "Declared Retirement Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cohortOriginYear",
          label: "Cohort Origin Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "fromRetirementDecimal",
          label: "From Retirement Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "retirementFromCohortDecimal",
          label: "Retirement From Cohort Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "eventFromCohortDecimal",
          label: "Event From Cohort Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = retirementEventOriginGapTool.execute;
export default retirementEventOriginGapTool;
