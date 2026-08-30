import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly stratumTotalAreasM2: readonly number[];
  readonly stratumCollectedAreasM2: readonly number[];
  readonly stratumSherdCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly stratumSampleFractions: readonly number[];
  readonly overallAreaSampleFraction: number;
  readonly stratifiedExpandedSherdCount: number;
}>;
const inputFields = [
  {
    id: "stratumTotalAreasM2",
    label: "Stratum total areas m2",
    kind: "numberList",
  },
  {
    id: "stratumCollectedAreasM2",
    label: "Stratum collected areas m2",
    kind: "numberList",
  },
  {
    id: "stratumSherdCounts",
    label: "Stratum sherd counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.stratumTotalAreasM2.forEach((v) => positive(v, "stratumTotalAreasM2"));
  input.stratumCollectedAreasM2.forEach((v) =>
    positive(v, "stratumCollectedAreasM2"),
  );
  input.stratumSherdCounts.forEach((v) => count(v, "stratumSherdCounts"));
  aligned(
    input.stratumTotalAreasM2,
    input.stratumCollectedAreasM2,
    "stratumTotalAreasM2",
  );
  aligned(
    input.stratumTotalAreasM2,
    input.stratumSherdCounts,
    "stratumTotalAreasM2",
  );
  const stratumSampleFractions = input.stratumTotalAreasM2.map((a, i) =>
    fraction(input.stratumCollectedAreasM2[i] / a, "stratumCollectedAreasM2"),
  );
  return {
    stratumSampleFractions,
    overallAreaSampleFraction:
      input.stratumCollectedAreasM2.reduce((a, b) => a + b, 0) /
      input.stratumTotalAreasM2.reduce((a, b) => a + b, 0),
    stratifiedExpandedSherdCount: input.stratumSherdCounts.reduce(
      (s, v, i) => s + v / stratumSampleFractions[i],
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stratumTotalAreasM2: [100, 200],
  stratumCollectedAreasM2: [10, 40],
  stratumSherdCounts: [5, 10],
} satisfies Input;
export const exampleOutput = {
  stratumSampleFractions: [0.1, 0.2],
  overallAreaSampleFraction: 0.16666666666666666,
  stratifiedExpandedSherdCount: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/surface-collection-sample-fraction",
  title: "Surface Collection Sample Fraction",
  description:
    "Compute area inclusion fractions and stratified expansion from sampled counts, assuming representative selection within each stratum; unequal strata are not replaced by a single uniform inclusion rate.",
  inputs: inputFields,
  outputs: [
    {
      id: "stratumSampleFractions",
      label: "Stratum sample fractions",
      kind: "numberList",
    },
    {
      id: "overallAreaSampleFraction",
      label: "Overall area sample fraction",
      kind: "number",
    },
    {
      id: "stratifiedExpandedSherdCount",
      label: "Stratified expanded sherd count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stratumTotalAreasM2: value.stratumTotalAreasM2 as readonly number[],
      stratumCollectedAreasM2:
        value.stratumCollectedAreasM2 as readonly number[],
      stratumSherdCounts: value.stratumSherdCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
