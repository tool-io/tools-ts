import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly cutMarkCountsByBone: readonly number[];
  readonly observableSurfaceAreasCm2: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanCutMarksPerExaminedBone: number;
  readonly markedBoneFraction: number;
  readonly pooledMarksPerObservableCm2: number;
}>;
const inputFields = [
  {
    id: "cutMarkCountsByBone",
    label: "Cut mark counts by bone",
    kind: "numberList",
  },
  {
    id: "observableSurfaceAreasCm2",
    label: "Observable surface areas cm2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observableSurfaceAreasCm2.forEach((v) =>
    positive(v, "observableSurfaceAreasCm2"),
  );
  input.cutMarkCountsByBone.forEach((v) => count(v, "cutMarkCountsByBone"));
  aligned(
    input.cutMarkCountsByBone,
    input.observableSurfaceAreasCm2,
    "cutMarkCountsByBone",
  );
  return {
    meanCutMarksPerExaminedBone: mean(input.cutMarkCountsByBone),
    markedBoneFraction:
      input.cutMarkCountsByBone.filter((v) => v > 0).length /
      input.cutMarkCountsByBone.length,
    pooledMarksPerObservableCm2:
      input.cutMarkCountsByBone.reduce((a, b) => a + b, 0) /
      input.observableSurfaceAreasCm2.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cutMarkCountsByBone: [0, 2, 4],
  observableSurfaceAreasCm2: [1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  meanCutMarksPerExaminedBone: 2,
  markedBoneFraction: 0.6666666666666666,
  pooledMarksPerObservableCm2: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/cut-mark-count-per-bone",
  title: "Cut Mark Count Per Bone Tool",
  description:
    "Distinguish count per examined bone, marked-bone prevalence and surface-standardized cut-mark density; observed mark identification remains caller supplied, not inferred butchery behavior.",
  inputs: inputFields,
  outputs: [
    {
      id: "meanCutMarksPerExaminedBone",
      label: "Mean cut marks per examined bone",
      kind: "number",
    },
    { id: "markedBoneFraction", label: "Marked bone fraction", kind: "number" },
    {
      id: "pooledMarksPerObservableCm2",
      label: "Pooled marks per observable cm2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cutMarkCountsByBone: value.cutMarkCountsByBone as readonly number[],
      observableSurfaceAreasCm2:
        value.observableSurfaceAreasCm2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
