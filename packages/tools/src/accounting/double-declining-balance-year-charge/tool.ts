import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, depreciation } from "../batch-shared.js";
export type Input = Readonly<{
  readonly assetCostMinor: number;
  readonly residualValueMinor: number;
  readonly usefulLifeYears: number;
}>;
export type Output = Readonly<{
  readonly annualDepreciationMinor: readonly number[];
  readonly yearEndBookValuesMinor: readonly number[];
}>;
const inputFields = [
  { id: "assetCostMinor", label: "Asset cost minor", kind: "number" },
  { id: "residualValueMinor", label: "Residual value minor", kind: "number" },
  { id: "usefulLifeYears", label: "Useful life years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return depreciation(
    input.assetCostMinor,
    input.residualValueMinor,
    input.usefulLifeYears,
    "ddb",
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  assetCostMinor: 1000,
  residualValueMinor: 100,
  usefulLifeYears: 4,
} satisfies Input;
export const exampleOutput = {
  annualDepreciationMinor: [500, 250, 125, 25],
  yearEndBookValuesMinor: [500, 250, 125, 100],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/double-declining-balance-year-charge",
  title: "Double Declining Balance Year Charge Calculator",
  description:
    "Generate bounded double-declining schedule, capped at residual value with caller book policy final-year residual true-up and half-up minor-unit charges; no automatic switch-to-straight-line or tax convention.",
  inputs: inputFields,
  outputs: [
    {
      id: "annualDepreciationMinor",
      label: "Annual depreciation minor",
      kind: "numberList",
    },
    {
      id: "yearEndBookValuesMinor",
      label: "Year end book values minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      assetCostMinor: value.assetCostMinor as number,
      residualValueMinor: value.residualValueMinor as number,
      usefulLifeYears: value.usefulLifeYears as number,
    }),
});
export const run = tool.execute;
export default tool;
