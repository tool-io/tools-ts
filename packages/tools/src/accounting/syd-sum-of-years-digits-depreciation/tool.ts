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
    "syd",
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  assetCostMinor: 1000,
  residualValueMinor: 100,
  usefulLifeYears: 3,
} satisfies Input;
export const exampleOutput = {
  annualDepreciationMinor: [450, 300, 150],
  yearEndBookValuesMinor: [550, 250, 100],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/syd-sum-of-years-digits-depreciation",
  title: "SYD Sum Of Years Digits Depreciation Calculator",
  description:
    "Generate sum-of-years-digits charges from actual cost/residual/life, with half-up minor-unit charges capped at residual and final exact residual true-up; not straight-line depreciation or tax advice.",
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
