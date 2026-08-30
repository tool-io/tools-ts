import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly ringWidthsMm: readonly number[];
  readonly representedYearsPerMeasurement: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalMeasuredRadialGrowthMm: number;
  readonly totalRepresentedYears: number;
  readonly averageGrowthMmPerYear: number;
}>;
const inputFields = [
  { id: "ringWidthsMm", label: "Ring widths mm", kind: "numberList" },
  {
    id: "representedYearsPerMeasurement",
    label: "Represented years per measurement",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedYearsPerMeasurement.forEach((v) =>
    positive(v, "representedYearsPerMeasurement"),
  );
  input.ringWidthsMm.forEach((v) => nonnegative(v, "ringWidthsMm"));
  input.representedYearsPerMeasurement.forEach((v) =>
    count(v, "representedYearsPerMeasurement"),
  );
  aligned(
    input.ringWidthsMm,
    input.representedYearsPerMeasurement,
    "ringWidthsMm",
  );
  const totalMeasuredRadialGrowthMm = input.ringWidthsMm.reduce(
      (a, b) => a + b,
      0,
    ),
    totalRepresentedYears = input.representedYearsPerMeasurement.reduce(
      (a, b) => a + b,
      0,
    );
  return {
    totalMeasuredRadialGrowthMm,
    totalRepresentedYears,
    averageGrowthMmPerYear: totalMeasuredRadialGrowthMm / totalRepresentedYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ringWidthsMm: [1, 2, 3],
  representedYearsPerMeasurement: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  totalMeasuredRadialGrowthMm: 6,
  totalRepresentedYears: 4,
  averageGrowthMmPerYear: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/tree-ring-width-average",
  title: "Average Tree Ring Width",
  description:
    "Calculate mean measured radial growth per represented year including multi-year measurements; not an unweighted width mean when measurements cover unequal time.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalMeasuredRadialGrowthMm",
      label: "Total measured radial growth mm",
      kind: "number",
    },
    {
      id: "totalRepresentedYears",
      label: "Total represented years",
      kind: "number",
    },
    {
      id: "averageGrowthMmPerYear",
      label: "Average growth mm per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ringWidthsMm: value.ringWidthsMm as readonly number[],
      representedYearsPerMeasurement:
        value.representedYearsPerMeasurement as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
