import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly transitionDurationsSeconds: readonly number[];
  readonly transitionDelaysSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly activeEndTimesSeconds: readonly number[];
  readonly concurrentCompletionSeconds: number;
  readonly serialSumSeconds: number;
}>;
const inputFields = [
  {
    id: "transitionDurationsSeconds",
    label: "Transition durations seconds",
    kind: "numberList",
  },
  {
    id: "transitionDelaysSeconds",
    label: "Transition delays seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.transitionDurationsSeconds.forEach((v) =>
    nonnegative(v, "transitionDurationsSeconds"),
  );
  aligned(
    input.transitionDurationsSeconds,
    input.transitionDelaysSeconds,
    "transitionDurationsSeconds",
  );
  const t = input.transitionDurationsSeconds.map((v, i) =>
    Math.max(0, v + input.transitionDelaysSeconds[i]),
  );
  return {
    activeEndTimesSeconds: t,
    concurrentCompletionSeconds: Math.max(...t),
    serialSumSeconds: sum(t),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  transitionDurationsSeconds: [1, 2],
  transitionDelaysSeconds: [0.5, -0.5],
} satisfies Input;
export const exampleOutput = {
  activeEndTimesSeconds: [1.5, 1.5],
  concurrentCompletionSeconds: 1.5,
  serialSumSeconds: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/transition-total-duration-multi-property-sum",
  title: "Transition Total Duration Multi-Property Sum",
  description:
    "Parallel property-transition completion is max(duration+delay,0), not sum; separately expose serial-sum diagnostic, negative delays supported. List repetition/cancellation external. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "activeEndTimesSeconds",
      label: "Active end times seconds",
      kind: "numberList",
    },
    {
      id: "concurrentCompletionSeconds",
      label: "Concurrent completion seconds",
      kind: "number",
    },
    { id: "serialSumSeconds", label: "Serial sum seconds", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      transitionDurationsSeconds:
        value.transitionDurationsSeconds as readonly number[],
      transitionDelaysSeconds:
        value.transitionDelaysSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
