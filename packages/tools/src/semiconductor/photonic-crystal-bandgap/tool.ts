import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
  strictlyIncreasing,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedBlochFrequenciesHz: readonly number[];
  readonly callerAllowedPropagatingModeCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedNoModeFrequencySamplesHz: readonly number[];
  readonly observedGapSampleRunsBoundsHz: readonly (readonly number[])[];
}>;
const inputFields = [
  {
    id: "observedBlochFrequenciesHz",
    label: "Observed bloch frequencies hz",
    kind: "numberList",
  },
  {
    id: "callerAllowedPropagatingModeCounts",
    label: "Caller allowed propagating mode counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBlochFrequenciesHz.forEach((v) =>
    positive(v, "observedBlochFrequenciesHz"),
  );
  aligned(
    input.observedBlochFrequenciesHz,
    input.callerAllowedPropagatingModeCounts,
    "observedBlochFrequenciesHz",
  );
  strictlyIncreasing(input.observedBlochFrequenciesHz, "frequency");
  input.callerAllowedPropagatingModeCounts.forEach((v) =>
    bounded(v, "modes", 0, 1000000),
  );
  const runs: number[][] = [];
  let start = -1;
  input.callerAllowedPropagatingModeCounts.forEach((v, i) => {
    if (v === 0 && start < 0) start = i;
    if (
      start >= 0 &&
      (v !== 0 || i === input.callerAllowedPropagatingModeCounts.length - 1)
    ) {
      runs.push([
        input.observedBlochFrequenciesHz[start],
        input.observedBlochFrequenciesHz[v === 0 ? i : i - 1],
      ]);
      start = -1;
    }
  });
  return {
    observedNoModeFrequencySamplesHz: input.observedBlochFrequenciesHz.filter(
      (_, i) => !input.callerAllowedPropagatingModeCounts[i],
    ),
    observedGapSampleRunsBoundsHz: runs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBlochFrequenciesHz: [1, 2, 3, 4],
  callerAllowedPropagatingModeCounts: [2, 0, 0, 3],
} satisfies Input;
export const exampleOutput = {
  observedNoModeFrequencySamplesHz: [2, 3],
  observedGapSampleRunsBoundsHz: [[2, 3]],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/photonic-crystal-bandgap",
  title: "Semiconductor Photonic Crystal Bandgap Calculator",
  description:
    "Locate actual zero-propagating-mode runs in independently computed photonic-crystal spectrum samples, not proof of unsampled complete bandgap or cavity Q.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedNoModeFrequencySamplesHz",
      label: "Observed no mode frequency samples hz",
      kind: "numberList",
    },
    {
      id: "observedGapSampleRunsBoundsHz",
      label: "Observed gap sample runs bounds hz",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBlochFrequenciesHz:
        value.observedBlochFrequenciesHz as readonly number[],
      callerAllowedPropagatingModeCounts:
        value.callerAllowedPropagatingModeCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
