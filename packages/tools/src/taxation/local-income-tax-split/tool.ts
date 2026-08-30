import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly jurisdictionWages: readonly number[];
  readonly localTaxRatesPercent: readonly number[];
}>;
export type Output = Readonly<{
  readonly localTaxes: readonly number[];
  readonly totalLocalTax: number;
  readonly effectiveRatePercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.jurisdictionWages.length === 0 ||
    input.jurisdictionWages.length !== input.localTaxRatesPercent.length ||
    input.jurisdictionWages.some((value) => value < 0) ||
    input.localTaxRatesPercent.some((value) => value < 0)
  )
    simpleError(
      "jurisdictionWages",
      "Wage and rate lists must be aligned, nonempty, and nonnegative.",
      "invalid_lists",
    );
  const localTaxes = input.jurisdictionWages.map(
    (value, index) => (value * input.localTaxRatesPercent[index]) / 100,
  );
  const totalLocalTax = localTaxes.reduce((a, b) => a + b, 0);
  const totalWages = input.jurisdictionWages.reduce((a, b) => a + b, 0);
  return {
    localTaxes,
    totalLocalTax,
    effectiveRatePercent:
      totalWages === 0 ? 0 : (totalLocalTax / totalWages) * 100,
  };
};

export const exampleInput = {
  jurisdictionWages: [1000, 2000],
  localTaxRatesPercent: [1, 2],
} satisfies Input;
export const exampleOutput = {
  localTaxes: [10, 40],
  totalLocalTax: 50,
  effectiveRatePercent: 1.6666666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      jurisdictionWages: input.jurisdictionWages as readonly number[],
      localTaxRatesPercent: input.localTaxRatesPercent as readonly number[],
    }),
  description:
    "Calculate local income tax across caller-supplied jurisdictions and rates.",
  id: "taxation/local-income-tax-split",
  inputs: [
    {
      id: "jurisdictionWages",
      label: "Wages by local jurisdiction",
      kind: "numberList",
    },
    {
      id: "localTaxRatesPercent",
      label: "Local rates by jurisdiction",
      kind: "numberList",
      unit: "%",
    },
  ],
  outputs: [
    { id: "localTaxes", label: "Tax by jurisdiction", kind: "numberList" },
    {
      id: "totalLocalTax",
      label: "Total local income tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "effectiveRatePercent",
      label: "Effective local tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Local Income Tax Split",
});

export const run = tool.execute;
export default tool;
