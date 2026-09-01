import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly scenePageCounts: readonly number[];
  readonly sceneMeasuredSecondsPerPage: readonly number[];
  readonly observedSceneTransitionSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly estimatedSceneRuntimeSeconds: readonly number[];
  readonly estimatedScenePlusTransitionSeconds: readonly number[];
  readonly totalEstimatedScriptRuntimeSeconds: number;
}>;
const inputFields = [
  { id: "scenePageCounts", label: "Scene page counts", kind: "numberList" },
  {
    id: "sceneMeasuredSecondsPerPage",
    label: "Scene measured seconds per page",
    kind: "numberList",
  },
  {
    id: "observedSceneTransitionSeconds",
    label: "Observed scene transition seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sceneMeasuredSecondsPerPage.forEach((v) =>
    positive(v, "sceneMeasuredSecondsPerPage"),
  );
  input.scenePageCounts.forEach((v) => nonnegative(v, "scenePageCounts"));
  input.observedSceneTransitionSeconds.forEach((v) =>
    nonnegative(v, "observedSceneTransitionSeconds"),
  );
  aligned(
    input.scenePageCounts,
    input.sceneMeasuredSecondsPerPage,
    "scenePageCounts",
  );
  aligned(
    input.scenePageCounts,
    input.observedSceneTransitionSeconds,
    "scenePageCounts",
  );
  const scenes = input.scenePageCounts.map(
      (v, i) => v * input.sceneMeasuredSecondsPerPage[i],
    ),
    combined = scenes.map(
      (v, i) => v + input.observedSceneTransitionSeconds[i],
    );
  return {
    estimatedSceneRuntimeSeconds: scenes,
    estimatedScenePlusTransitionSeconds: combined,
    totalEstimatedScriptRuntimeSeconds: sum(combined),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  scenePageCounts: [2, 3],
  sceneMeasuredSecondsPerPage: [60, 90],
  observedSceneTransitionSeconds: [10, 20],
} satisfies Input;
export const exampleOutput = {
  estimatedSceneRuntimeSeconds: [120, 270],
  estimatedScenePlusTransitionSeconds: [130, 290],
  totalEstimatedScriptRuntimeSeconds: 420,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/script-page-per-minute-scene-timing-calculator",
  title: "Script Page Per Minute Scene Timing Calculator",
  description:
    "Plan actual scene-level calibrated page-time rates plus separately measured transitions; not universal one-page/minute, generic package sum or conflating cue-to-cue rehearsing with scripted duration.",
  inputs: inputFields,
  outputs: [
    {
      id: "estimatedSceneRuntimeSeconds",
      label: "Estimated scene runtime seconds",
      kind: "numberList",
    },
    {
      id: "estimatedScenePlusTransitionSeconds",
      label: "Estimated scene plus transition seconds",
      kind: "numberList",
    },
    {
      id: "totalEstimatedScriptRuntimeSeconds",
      label: "Total estimated script runtime seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      scenePageCounts: value.scenePageCounts as readonly number[],
      sceneMeasuredSecondsPerPage:
        value.sceneMeasuredSecondsPerPage as readonly number[],
      observedSceneTransitionSeconds:
        value.observedSceneTransitionSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
