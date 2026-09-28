import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dailyInternationalLine: number;
  readonly localCurrencyPerInternational: number;
  readonly householdWeight: number;
  readonly days: number;
  readonly observedHouseholdIncome: number;
};
export type Output = {
  readonly localPeriodLine: number;
  readonly incomeGap: number;
  readonly belowLine: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dailyInternationalLine: { type: "number", minimum: 0 },
    localCurrencyPerInternational: { type: "number", exclusiveMinimum: 0 },
    householdWeight: { type: "number", exclusiveMinimum: 0 },
    days: { type: "number", minimum: 0 },
    observedHouseholdIncome: { type: "number" },
  },
  required: [
    "dailyInternationalLine",
    "localCurrencyPerInternational",
    "householdWeight",
    "days",
    "observedHouseholdIncome",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localPeriodLine: { type: "number" },
    incomeGap: { type: "number" },
    belowLine: { type: "boolean" },
  },
  required: ["localPeriodLine", "incomeGap", "belowLine"],
} as const;
/** Caller-specified PPP line conversion and household comparison; no official poverty line or equivalence scale is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    dailyInternationalLine,
    localCurrencyPerInternational,
    householdWeight,
    days,
    observedHouseholdIncome,
  } = request;
  const compute = (): Output => {
    H.domain(dailyInternationalLine >= 0 && days >= 0);
    H.positive(localCurrencyPerInternational);
    H.positive(householdWeight);
    return {
      localPeriodLine:
        dailyInternationalLine *
        localCurrencyPerInternational *
        householdWeight *
        days,
      incomeGap:
        observedHouseholdIncome -
        dailyInternationalLine *
          localCurrencyPerInternational *
          householdWeight *
          days,
      belowLine:
        observedHouseholdIncome <
        dailyInternationalLine *
          localCurrencyPerInternational *
          householdWeight *
          days,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dailyInternationalLine: 3,
    localCurrencyPerInternational: 2,
    householdWeight: 4,
    days: 30,
    observedHouseholdIncome: 600,
  },
  output: { localPeriodLine: 720, incomeGap: -120, belowLine: true },
} satisfies ToolExample<Input, Output>;
export const globalPovertyLineCallerPppTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/global-poverty-line-caller-ppp-term",
    title: "Global Poverty Line Caller PPP Term Tool",
    description:
      "Caller-specified PPP line conversion and household comparison; no official poverty line or equivalence scale is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dailyInternationalLine: { type: "number", minimum: 0 },
        localCurrencyPerInternational: { type: "number", exclusiveMinimum: 0 },
        householdWeight: { type: "number", exclusiveMinimum: 0 },
        days: { type: "number", minimum: 0 },
        observedHouseholdIncome: { type: "number" },
      },
      required: [
        "dailyInternationalLine",
        "localCurrencyPerInternational",
        "householdWeight",
        "days",
        "observedHouseholdIncome",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localPeriodLine: { type: "number" },
        incomeGap: { type: "number" },
        belowLine: { type: "boolean" },
      },
      required: ["localPeriodLine", "incomeGap", "belowLine"],
    },
    ports: {
      inputs: [
        {
          id: "dailyInternationalLine",
          label: "Daily International Line",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "localCurrencyPerInternational",
          label: "Local Currency Per International",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "householdWeight",
          label: "Household Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedHouseholdIncome",
          label: "Observed Household Income",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "localPeriodLine",
          label: "Local Period Line",
          valueType: { type: "number" },
        },
        { id: "incomeGap", label: "Income Gap", valueType: { type: "number" } },
        {
          id: "belowLine",
          label: "Below Line",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = globalPovertyLineCallerPppTermTool.execute;
export default globalPovertyLineCallerPppTermTool;
