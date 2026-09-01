import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
  sumMoney,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly blockNetPlantableAreasHa: readonly number[];
  readonly callerRowSpacingM: readonly number[];
  readonly callerInRowSpacingM: readonly number[];
}>;
export type Output = Readonly<{
  readonly idealPositionsPerHaByBlock: readonly number[];
  readonly idealWholeAreaBudgetVinePositions: readonly number[];
  readonly combinedWholeAreaBudgetPositions: number;
}>;
const inputFields = [
  {
    id: "blockNetPlantableAreasHa",
    label: "Block net plantable areas ha",
    kind: "numberList",
  },
  {
    id: "callerRowSpacingM",
    label: "Caller row spacing m",
    kind: "numberList",
  },
  {
    id: "callerInRowSpacingM",
    label: "Caller in row spacing m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerRowSpacingM.forEach((v) => positive(v, "callerRowSpacingM"));
  input.callerInRowSpacingM.forEach((v) => positive(v, "callerInRowSpacingM"));
  input.blockNetPlantableAreasHa.forEach((v) =>
    nonnegative(v, "blockNetPlantableAreasHa"),
  );
  aligned(
    input.blockNetPlantableAreasHa,
    input.callerRowSpacingM,
    "blockNetPlantableAreasHa",
  );
  aligned(
    input.blockNetPlantableAreasHa,
    input.callerInRowSpacingM,
    "blockNetPlantableAreasHa",
  );
  const density = input.callerRowSpacingM.map(
      (v, i) => 10000 / v / input.callerInRowSpacingM[i],
    ),
    counts = density.map((v, i) =>
      bounded(
        Math.floor(v * input.blockNetPlantableAreasHa[i]),
        "positions",
        0,
        10000000,
      ),
    );
  return {
    idealPositionsPerHaByBlock: density,
    idealWholeAreaBudgetVinePositions: counts,
    combinedWholeAreaBudgetPositions: sumMoney(counts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  blockNetPlantableAreasHa: [1, 2],
  callerRowSpacingM: [2, 2.5],
  callerInRowSpacingM: [1, 2],
} satisfies Input;
export const exampleOutput = {
  idealPositionsPerHaByBlock: [5000, 2000],
  idealWholeAreaBudgetVinePositions: [5000, 4000],
  combinedWholeAreaBudgetPositions: 9000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/vine-spacing-density-per-hectare",
  title: "Vine Spacing Density Per Hectare Calculator",
  description:
    "Budget independently supplied net plantable block areas under actual heterogeneous row/in-row spacings; area-density ideal excludes boundary endpoints, unlike existing unequal-row position solver, no field placement or yield guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealPositionsPerHaByBlock",
      label: "Ideal positions per ha by block",
      kind: "numberList",
    },
    {
      id: "idealWholeAreaBudgetVinePositions",
      label: "Ideal whole area budget vine positions",
      kind: "numberList",
    },
    {
      id: "combinedWholeAreaBudgetPositions",
      label: "Combined whole area budget positions",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      blockNetPlantableAreasHa:
        value.blockNetPlantableAreasHa as readonly number[],
      callerRowSpacingM: value.callerRowSpacingM as readonly number[],
      callerInRowSpacingM: value.callerInRowSpacingM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
