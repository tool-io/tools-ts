import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly businessMiles: number;
  readonly standardMileageRate: number;
  readonly depreciationComponentRate: number;
}>;
export type Output = Readonly<{
  readonly standardMileageDeduction: number;
  readonly depreciationComponent: number;
  readonly nonDepreciationComponent: number;
}>;

export const calculate = (input: Input): Output => {
  const standardMileageDeduction =
    input.businessMiles * input.standardMileageRate;
  const depreciationComponent =
    input.businessMiles * input.depreciationComponentRate;
  return {
    standardMileageDeduction,
    depreciationComponent,
    nonDepreciationComponent: standardMileageDeduction - depreciationComponent,
  };
};

export const exampleInput = {
  businessMiles: 1000,
  standardMileageRate: 0.7,
  depreciationComponentRate: 0.3,
} satisfies Input;
export const exampleOutput = {
  standardMileageDeduction: 700,
  depreciationComponent: 300,
  nonDepreciationComponent: 400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      businessMiles: input.businessMiles as number,
      standardMileageRate: input.standardMileageRate as number,
      depreciationComponentRate: input.depreciationComponentRate as number,
    }),
  description:
    "Split a standard-mileage deduction into depreciation and non-depreciation components.",
  id: "taxation/mileage-depreciation",
  inputs: [
    {
      id: "businessMiles",
      label: "Business miles",
      kind: "number",
      minimum: 0,
      unit: "mi",
    },
    {
      id: "standardMileageRate",
      label: "Standard mileage rate",
      kind: "number",
      minimum: 0,
      unit: "currency/mi",
    },
    {
      id: "depreciationComponentRate",
      label: "Included depreciation rate",
      kind: "number",
      minimum: 0,
      unit: "currency/mi",
    },
  ],
  outputs: [
    {
      id: "standardMileageDeduction",
      label: "Standard mileage deduction",
      kind: "number",
      minimum: 0,
    },
    {
      id: "depreciationComponent",
      label: "Included depreciation component",
      kind: "number",
      minimum: 0,
    },
    {
      id: "nonDepreciationComponent",
      label: "Non-depreciation component",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Mileage Depreciation",
});

export const run = tool.execute;
export default tool;
