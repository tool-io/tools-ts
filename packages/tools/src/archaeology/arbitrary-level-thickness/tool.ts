import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly startDepthM: number;
  readonly endDepthM: number;
  readonly targetLevelThicknessM: number;
}>;
export type Output = Readonly<{
  readonly levelTopDepthsM: readonly number[];
  readonly levelBottomDepthsM: readonly number[];
  readonly levelThicknessesM: readonly number[];
}>;
const inputFields = [
  { id: "startDepthM", label: "Start depth m", kind: "number" },
  { id: "endDepthM", label: "End depth m", kind: "number" },
  {
    id: "targetLevelThicknessM",
    label: "Target level thickness m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.targetLevelThicknessM, "targetLevelThicknessM");
  nonnegative(input.startDepthM, "startDepthM");
  nonnegative(input.endDepthM, "endDepthM");
  positive(input.endDepthM - input.startDepthM, "endDepthM");
  const ratio =
      (input.endDepthM - input.startDepthM) / input.targetLevelThicknessM,
    n = Math.ceil(ratio - 8 * Number.EPSILON * Math.max(1, ratio));
  if (n < 1 || n > 10000)
    simpleError("targetLevelThicknessM", "Require 1–10000 excavation levels.");
  const levelTopDepthsM = Array.from(
      { length: n },
      (_, i) => input.startDepthM + i * input.targetLevelThicknessM,
    ),
    levelBottomDepthsM = levelTopDepthsM.map((d) =>
      Math.min(input.endDepthM, d + input.targetLevelThicknessM),
    );
  return {
    levelTopDepthsM,
    levelBottomDepthsM,
    levelThicknessesM: levelTopDepthsM.map((d, i) =>
      positive(levelBottomDepthsM[i] - d, "representableLevelThickness"),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  startDepthM: 0.1,
  endDepthM: 0.35,
  targetLevelThicknessM: 0.1,
} satisfies Input;
export const exampleOutput = {
  levelTopDepthsM: [0.1, 0.2, 0.3],
  levelBottomDepthsM: [0.2, 0.3, 0.35],
  levelThicknessesM: [0.1, 0.1, 0.05],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/arbitrary-level-thickness",
  title: "Arbitrary Level Thickness",
  description:
    "Partition a measured positive-down depth interval into caller target spits, retaining the final partial level and scale-relative rounding slack; no stratigraphic boundaries inferred.",
  inputs: inputFields,
  outputs: [
    { id: "levelTopDepthsM", label: "Level top depths m", kind: "numberList" },
    {
      id: "levelBottomDepthsM",
      label: "Level bottom depths m",
      kind: "numberList",
    },
    {
      id: "levelThicknessesM",
      label: "Level thicknesses m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      startDepthM: value.startDepthM as number,
      endDepthM: value.endDepthM as number,
      targetLevelThicknessM: value.targetLevelThicknessM as number,
    }),
});
export const run = tool.execute;
export default tool;
