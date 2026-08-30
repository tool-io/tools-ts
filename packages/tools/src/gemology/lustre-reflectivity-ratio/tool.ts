import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredSpecularSignals: readonly number[];
  readonly measuredTotalReflectedSignals: readonly number[];
  readonly backgroundSignals: readonly number[];
  readonly representedAngularWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly backgroundCorrectedSpecularShare: number;
  readonly backgroundCorrectedTotalSignal: number;
}>;
const inputFields = [
  {
    id: "measuredSpecularSignals",
    label: "Measured specular signals",
    kind: "numberList",
  },
  {
    id: "measuredTotalReflectedSignals",
    label: "Measured total reflected signals",
    kind: "numberList",
  },
  { id: "backgroundSignals", label: "Background signals", kind: "numberList" },
  {
    id: "representedAngularWeights",
    label: "Represented angular weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedAngularWeights.forEach((v) =>
    positive(v, "representedAngularWeights"),
  );
  input.measuredSpecularSignals.forEach((v) =>
    nonnegative(v, "measuredSpecularSignals"),
  );
  input.measuredTotalReflectedSignals.forEach((v) =>
    nonnegative(v, "measuredTotalReflectedSignals"),
  );
  input.backgroundSignals.forEach((v) => nonnegative(v, "backgroundSignals"));
  aligned(
    input.measuredSpecularSignals,
    input.measuredTotalReflectedSignals,
    "measuredSpecularSignals",
  );
  aligned(
    input.measuredSpecularSignals,
    input.backgroundSignals,
    "measuredSpecularSignals",
  );
  aligned(
    input.measuredSpecularSignals,
    input.representedAngularWeights,
    "measuredSpecularSignals",
  );
  if (
    input.measuredSpecularSignals.some(
      (v, i) => v > input.measuredTotalReflectedSignals[i],
    )
  )
    simpleError(
      "signals",
      "Specular signal cannot exceed matched total signal.",
    );
  const spec = input.measuredSpecularSignals.reduce(
      (s, v, i) =>
        s +
        (v - input.backgroundSignals[i]) * input.representedAngularWeights[i],
      0,
    ),
    backgroundCorrectedTotalSignal = positive(
      input.measuredTotalReflectedSignals.reduce(
        (s, v, i) =>
          s +
          (v - input.backgroundSignals[i]) * input.representedAngularWeights[i],
        0,
      ),
      "totalSignal",
    );
  return {
    backgroundCorrectedSpecularShare: spec / backgroundCorrectedTotalSignal,
    backgroundCorrectedTotalSignal,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredSpecularSignals: [5, 10],
  measuredTotalReflectedSignals: [10, 20],
  backgroundSignals: [1, 2],
  representedAngularWeights: [1, 2],
} satisfies Input;
export const exampleOutput = {
  backgroundCorrectedSpecularShare: 0.4444444444444444,
  backgroundCorrectedTotalSignal: 45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/lustre-reflectivity-ratio",
  title: "Lustre Reflectivity Ratio",
  description:
    "Audit measured specular/total reflected signal with independently supplied background and angular exposure, retaining signed overcorrection; not absolute reflectance, Fresnel theory or validated lustre grading.",
  inputs: inputFields,
  outputs: [
    {
      id: "backgroundCorrectedSpecularShare",
      label: "Background corrected specular share",
      kind: "number",
    },
    {
      id: "backgroundCorrectedTotalSignal",
      label: "Background corrected total signal",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredSpecularSignals:
        value.measuredSpecularSignals as readonly number[],
      measuredTotalReflectedSignals:
        value.measuredTotalReflectedSignals as readonly number[],
      backgroundSignals: value.backgroundSignals as readonly number[],
      representedAngularWeights:
        value.representedAngularWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
