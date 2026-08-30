import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly plotRegenerationCounts: readonly number[];
  readonly plotAreasHa: readonly number[];
  readonly callerMinimumDensityPerHa: number;
}>;
export type Output = Readonly<{
  readonly pooledRegenerationPerHa: number;
  readonly plotBelowCallerMinimumFlags: readonly number[];
  readonly belowMinimumPlotFraction: number;
}>;
const inputFields = [
  {
    id: "plotRegenerationCounts",
    label: "Plot regeneration counts",
    kind: "numberList",
  },
  { id: "plotAreasHa", label: "Plot areas ha", kind: "numberList" },
  {
    id: "callerMinimumDensityPerHa",
    label: "Caller minimum density per ha",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.plotAreasHa.forEach((v) => positive(v, "plotAreasHa"));
  nonnegative(input.callerMinimumDensityPerHa, "callerMinimumDensityPerHa");
  input.plotRegenerationCounts.forEach((v) =>
    count(v, "plotRegenerationCounts"),
  );
  aligned(
    input.plotRegenerationCounts,
    input.plotAreasHa,
    "plotRegenerationCounts",
  );
  const plotBelowCallerMinimumFlags = input.plotRegenerationCounts.map(
    (v, i) =>
      v / input.plotAreasHa[i] < input.callerMinimumDensityPerHa ? 1 : 0,
  );
  return {
    pooledRegenerationPerHa:
      input.plotRegenerationCounts.reduce((a, b) => a + b, 0) /
      input.plotAreasHa.reduce((a, b) => a + b, 0),
    plotBelowCallerMinimumFlags,
    belowMinimumPlotFraction: mean(plotBelowCallerMinimumFlags),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plotRegenerationCounts: [2, 4, 0],
  plotAreasHa: [0.01, 0.02, 0.01],
  callerMinimumDensityPerHa: 100,
} satisfies Input;
export const exampleOutput = {
  pooledRegenerationPerHa: 150,
  plotBelowCallerMinimumFlags: [0, 0, 1],
  belowMinimumPlotFraction: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/natural-regeneration-stock-count-per-hectare-minimum",
  title: "Natural Regeneration Stock Minimum Count Tool",
  description:
    "Audit field regeneration counts against caller local minimum density, retaining patch-level shortfall rather than hiding unstocked plots in the pooled density; not legal stocking compliance.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledRegenerationPerHa",
      label: "Pooled regeneration per ha",
      kind: "number",
    },
    {
      id: "plotBelowCallerMinimumFlags",
      label: "Plot below caller minimum flags",
      kind: "numberList",
    },
    {
      id: "belowMinimumPlotFraction",
      label: "Below minimum plot fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      plotRegenerationCounts: value.plotRegenerationCounts as readonly number[],
      plotAreasHa: value.plotAreasHa as readonly number[],
      callerMinimumDensityPerHa: value.callerMinimumDensityPerHa as number,
    }),
});
export const run = tool.execute;
export default tool;
