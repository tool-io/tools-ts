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
  readonly quadratAreasCm2: readonly number[];
  readonly quadratEggCounts: readonly number[];
  readonly sheetUsableAreaCm2: number;
  readonly callerMaximumEggDensityPerCm2: number;
}>;
export type Output = Readonly<{
  readonly pooledEggDensityPerCm2: number;
  readonly estimatedSheetEggCount: number;
  readonly localAboveCallerDensityFlags: readonly number[];
}>;
const inputFields = [
  { id: "quadratAreasCm2", label: "Quadrat areas cm2", kind: "numberList" },
  { id: "quadratEggCounts", label: "Quadrat egg counts", kind: "numberList" },
  { id: "sheetUsableAreaCm2", label: "Sheet usable area cm2", kind: "number" },
  {
    id: "callerMaximumEggDensityPerCm2",
    label: "Caller maximum egg density per cm2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.quadratAreasCm2.forEach((v) => positive(v, "quadratAreasCm2"));
  nonnegative(input.sheetUsableAreaCm2, "sheetUsableAreaCm2");
  nonnegative(
    input.callerMaximumEggDensityPerCm2,
    "callerMaximumEggDensityPerCm2",
  );
  input.quadratEggCounts.forEach((v) => count(v, "quadratEggCounts"));
  aligned(input.quadratAreasCm2, input.quadratEggCounts, "quadratAreasCm2");
  const pooledEggDensityPerCm2 =
    input.quadratEggCounts.reduce((a, b) => a + b, 0) /
    input.quadratAreasCm2.reduce((a, b) => a + b, 0);
  return {
    pooledEggDensityPerCm2,
    estimatedSheetEggCount: pooledEggDensityPerCm2 * input.sheetUsableAreaCm2,
    localAboveCallerDensityFlags: input.quadratEggCounts.map((v, i) =>
      v / input.quadratAreasCm2[i] > input.callerMaximumEggDensityPerCm2
        ? 1
        : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  quadratAreasCm2: [1, 2],
  quadratEggCounts: [100, 100],
  sheetUsableAreaCm2: 10,
  callerMaximumEggDensityPerCm2: 70,
} satisfies Input;
export const exampleOutput = {
  pooledEggDensityPerCm2: 66.66666666666667,
  estimatedSheetEggCount: 666.6666666666666,
  localAboveCallerDensityFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/grainage-egg-sheet-density-count",
  title: "Grainage Egg Sheet Density Count",
  description:
    "Estimate grainage egg-sheet inventory from area-weighted quadrats while preserving local density-limit flags; quadrats must represent the usable sheet and no Poisson precision claim is made.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledEggDensityPerCm2",
      label: "Pooled egg density per cm2",
      kind: "number",
    },
    {
      id: "estimatedSheetEggCount",
      label: "Estimated sheet egg count",
      kind: "number",
    },
    {
      id: "localAboveCallerDensityFlags",
      label: "Local above caller density flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      quadratAreasCm2: value.quadratAreasCm2 as readonly number[],
      quadratEggCounts: value.quadratEggCounts as readonly number[],
      sheetUsableAreaCm2: value.sheetUsableAreaCm2 as number,
      callerMaximumEggDensityPerCm2:
        value.callerMaximumEggDensityPerCm2 as number,
    }),
});
export const run = tool.execute;
export default tool;
