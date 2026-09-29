import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gdp: number;
  readonly netIncomeFromAbroad: number;
  readonly netTransfers: number;
  readonly domesticAbsorption: number;
};
export type Output = {
  readonly nationalDisposableIncome: number;
  readonly currentAccountIdentity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gdp: { type: "number" },
    netIncomeFromAbroad: { type: "number" },
    netTransfers: { type: "number" },
    domesticAbsorption: { type: "number" },
  },
  required: [
    "gdp",
    "netIncomeFromAbroad",
    "netTransfers",
    "domesticAbsorption",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nationalDisposableIncome: { type: "number" },
    currentAccountIdentity: { type: "number" },
  },
  required: ["nationalDisposableIncome", "currentAccountIdentity"],
} as const;
/** National disposable income minus domestic absorption accounting identity, with compatible supplied national accounts boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gdp, netIncomeFromAbroad, netTransfers, domesticAbsorption } =
    request;
  const compute = (): Output => {
    return {
      nationalDisposableIncome: gdp + netIncomeFromAbroad + netTransfers,
      currentAccountIdentity:
        gdp + netIncomeFromAbroad + netTransfers - domesticAbsorption,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gdp: 1000,
    netIncomeFromAbroad: 20,
    netTransfers: -10,
    domesticAbsorption: 950,
  },
  output: { nationalDisposableIncome: 1010, currentAccountIdentity: 60 },
} satisfies ToolExample<Input, Output>;
export const foreignIncomeDomesticAbsorptionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/foreign-income-domestic-absorption-gap",
    title: "Foreign Income Domestic Absorption Gap Tool",
    description:
      "National disposable income minus domestic absorption accounting identity, with compatible supplied national accounts boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gdp: { type: "number" },
        netIncomeFromAbroad: { type: "number" },
        netTransfers: { type: "number" },
        domesticAbsorption: { type: "number" },
      },
      required: [
        "gdp",
        "netIncomeFromAbroad",
        "netTransfers",
        "domesticAbsorption",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nationalDisposableIncome: { type: "number" },
        currentAccountIdentity: { type: "number" },
      },
      required: ["nationalDisposableIncome", "currentAccountIdentity"],
    },
    ports: {
      inputs: [
        {
          id: "gdp",
          label: "Gdp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "netIncomeFromAbroad",
          label: "Net Income From Abroad",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "netTransfers",
          label: "Net Transfers",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "domesticAbsorption",
          label: "Domestic Absorption",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nationalDisposableIncome",
          label: "National Disposable Income",
          valueType: { type: "number" },
        },
        {
          id: "currentAccountIdentity",
          label: "Current Account Identity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foreignIncomeDomesticAbsorptionGapTool.execute;
export default foreignIncomeDomesticAbsorptionGapTool;
