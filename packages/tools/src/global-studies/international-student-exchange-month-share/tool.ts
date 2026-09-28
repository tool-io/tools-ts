import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exchangeMonths: number;
  readonly programMonths: number;
  readonly monthlyGrant: number;
  readonly fundedFraction: number;
};
export type Output = {
  readonly programShare: number;
  readonly fundedMonths: number;
  readonly grantTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exchangeMonths: { type: "number", minimum: 0 },
    programMonths: { type: "number", exclusiveMinimum: 0 },
    monthlyGrant: { type: "number", minimum: 0 },
    fundedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "exchangeMonths",
    "programMonths",
    "monthlyGrant",
    "fundedFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    programShare: { type: "number" },
    fundedMonths: { type: "number" },
    grantTotal: { type: "number" },
  },
  required: ["programShare", "fundedMonths", "grantTotal"],
} as const;
/** Calculate international student exchange month share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exchangeMonths, programMonths, monthlyGrant, fundedFraction } =
    request;
  const compute = (): Output => {
    H.positive(programMonths);
    H.domain(
      exchangeMonths >= 0 &&
        exchangeMonths <= programMonths &&
        monthlyGrant >= 0,
    );
    H.probability(fundedFraction);
    return {
      programShare: exchangeMonths / programMonths,
      fundedMonths: exchangeMonths * fundedFraction,
      grantTotal: exchangeMonths * fundedFraction * monthlyGrant,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exchangeMonths: 6,
    programMonths: 24,
    monthlyGrant: 500,
    fundedFraction: 0.8,
  },
  output: {
    programShare: 0.25,
    fundedMonths: 4.800000000000001,
    grantTotal: 2400.0000000000005,
  },
} satisfies ToolExample<Input, Output>;
export const internationalStudentExchangeMonthShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/international-student-exchange-month-share",
      title: "International Student Exchange Month Share Tool",
      description:
        "Calculate international student exchange month share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exchangeMonths: { type: "number", minimum: 0 },
          programMonths: { type: "number", exclusiveMinimum: 0 },
          monthlyGrant: { type: "number", minimum: 0 },
          fundedFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "exchangeMonths",
          "programMonths",
          "monthlyGrant",
          "fundedFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          programShare: { type: "number" },
          fundedMonths: { type: "number" },
          grantTotal: { type: "number" },
        },
        required: ["programShare", "fundedMonths", "grantTotal"],
      },
      ports: {
        inputs: [
          {
            id: "exchangeMonths",
            label: "Exchange Months",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "programMonths",
            label: "Program Months",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "monthlyGrant",
            label: "Monthly Grant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fundedFraction",
            label: "Funded Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "programShare",
            label: "Program Share",
            valueType: { type: "number" },
          },
          {
            id: "fundedMonths",
            label: "Funded Months",
            valueType: { type: "number" },
          },
          {
            id: "grantTotal",
            label: "Grant Total",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = internationalStudentExchangeMonthShareTool.execute;
export default internationalStudentExchangeMonthShareTool;
