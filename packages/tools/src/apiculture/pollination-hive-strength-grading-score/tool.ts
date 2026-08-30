import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly beeCoveredFrameCounts: readonly number[];
  readonly broodAreasCm2: readonly number[];
  readonly queenPresentFlags: readonly number[];
  readonly minimumCoveredFrames: number;
  readonly minimumBroodAreaCm2: number;
}>;
export type Output = Readonly<{
  readonly callerStrengthQualifiedFlags: readonly number[];
  readonly unmetCriterionBitMasks: readonly number[];
}>;
const inputFields = [
  {
    id: "beeCoveredFrameCounts",
    label: "Bee covered frame counts",
    kind: "numberList",
  },
  { id: "broodAreasCm2", label: "Brood areas cm2", kind: "numberList" },
  { id: "queenPresentFlags", label: "Queen present flags", kind: "numberList" },
  {
    id: "minimumCoveredFrames",
    label: "Minimum covered frames",
    kind: "integer",
  },
  {
    id: "minimumBroodAreaCm2",
    label: "Minimum brood area cm2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.broodAreasCm2.forEach((v) => nonnegative(v, "broodAreasCm2"));
  nonnegative(input.minimumBroodAreaCm2, "minimumBroodAreaCm2");
  input.beeCoveredFrameCounts.forEach((v) => count(v, "beeCoveredFrameCounts"));
  count(input.minimumCoveredFrames, "minimumCoveredFrames");
  aligned(
    input.beeCoveredFrameCounts,
    input.broodAreasCm2,
    "beeCoveredFrameCounts",
  );
  aligned(
    input.beeCoveredFrameCounts,
    input.queenPresentFlags,
    "beeCoveredFrameCounts",
  );
  if (input.queenPresentFlags.some((v) => v !== 0 && v !== 1))
    simpleError("queenPresentFlags", "Binary observed queen flags required.");
  const unmetCriterionBitMasks = input.beeCoveredFrameCounts.map(
    (v, i) =>
      (v < input.minimumCoveredFrames ? 1 : 0) +
      (input.broodAreasCm2[i] < input.minimumBroodAreaCm2 ? 2 : 0) +
      (input.queenPresentFlags[i] === 0 ? 4 : 0),
  );
  return {
    callerStrengthQualifiedFlags: unmetCriterionBitMasks.map((v) =>
      v === 0 ? 1 : 0,
    ),
    unmetCriterionBitMasks,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  beeCoveredFrameCounts: [4, 7, 8],
  broodAreasCm2: [100, 200, 300],
  queenPresentFlags: [1, 1, 0],
  minimumCoveredFrames: 6,
  minimumBroodAreaCm2: 150,
} satisfies Input;
export const exampleOutput = {
  callerStrengthQualifiedFlags: [0, 1, 0],
  unmetCriterionBitMasks: [3, 0, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/pollination-hive-strength-grading-score",
  title: "Pollination Hive Strength Grading Scorer",
  description:
    "Audit supplied pollination-strength contract criteria with explicit frame/brood/queen reason bits; no standardized grade, health certification or crop pollination guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerStrengthQualifiedFlags",
      label: "Caller strength qualified flags",
      kind: "numberList",
    },
    {
      id: "unmetCriterionBitMasks",
      label: "Unmet criterion bit masks",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      beeCoveredFrameCounts: value.beeCoveredFrameCounts as readonly number[],
      broodAreasCm2: value.broodAreasCm2 as readonly number[],
      queenPresentFlags: value.queenPresentFlags as readonly number[],
      minimumCoveredFrames: value.minimumCoveredFrames as number,
      minimumBroodAreaCm2: value.minimumBroodAreaCm2 as number,
    }),
});
export const run = tool.execute;
export default tool;
