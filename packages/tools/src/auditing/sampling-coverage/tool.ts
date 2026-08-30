import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly populationItemCount: number;
  readonly selectedItemCount: number;
  readonly populationValue: number;
  readonly selectedItemValue: number;
  readonly minimumValueCoveragePercent: number;
}>;
export type Output = Readonly<{
  readonly itemCoveragePercent: number;
  readonly valueCoveragePercent: number;
  readonly unselectedItemCount: number;
  readonly meetsValueCoverage: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.populationItemCount <= 0 ||
    input.populationValue <= 0 ||
    input.selectedItemCount > input.populationItemCount ||
    input.selectedItemValue > input.populationValue
  )
    simpleError(
      "populationItemCount",
      "Population totals must be positive and at least selected totals.",
      "invalid_population",
    );
  const valueCoveragePercent =
    (input.selectedItemValue / input.populationValue) * 100;
  return {
    itemCoveragePercent:
      (input.selectedItemCount / input.populationItemCount) * 100,
    valueCoveragePercent,
    unselectedItemCount: input.populationItemCount - input.selectedItemCount,
    meetsValueCoverage:
      valueCoveragePercent >= input.minimumValueCoveragePercent,
  };
};

export const exampleInput = {
  populationItemCount: 100,
  selectedItemCount: 20,
  populationValue: 1000,
  selectedItemValue: 800,
  minimumValueCoveragePercent: 75,
} satisfies Input;
export const exampleOutput = {
  itemCoveragePercent: 20,
  valueCoveragePercent: 80,
  unselectedItemCount: 80,
  meetsValueCoverage: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      populationItemCount: input.populationItemCount as number,
      selectedItemCount: input.selectedItemCount as number,
      populationValue: input.populationValue as number,
      selectedItemValue: input.selectedItemValue as number,
      minimumValueCoveragePercent: input.minimumValueCoveragePercent as number,
    }),
  description: "Measure audit sample coverage by item count and value.",
  id: "auditing/sampling-coverage",
  inputs: [
    {
      id: "populationItemCount",
      label: "Population item count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "selectedItemCount",
      label: "Selected item count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "populationValue",
      label: "Population value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "selectedItemValue",
      label: "Selected item value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumValueCoveragePercent",
      label: "Minimum value coverage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "itemCoveragePercent",
      label: "Item-count coverage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "valueCoveragePercent",
      label: "Value coverage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "unselectedItemCount",
      label: "Unselected item count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "meetsValueCoverage",
      label: "Meets supplied value coverage",
      kind: "boolean",
    },
  ],
  title: "Sampling Coverage",
});

export const run = tool.execute;
export default tool;
