import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  extrema,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedSoundProfileDepthM: readonly number[];
  readonly observedSoundSpeedsMSecond: readonly number[];
}>;
export type Output = Readonly<{
  readonly sampledSofarMinimumDepthsM: readonly number[];
  readonly minimumObservedSoundSpeedMSecond: number;
}>;
const inputFields = [
  {
    id: "observedSoundProfileDepthM",
    label: "Observed sound profile depth m",
    kind: "numberList",
  },
  {
    id: "observedSoundSpeedsMSecond",
    label: "Observed sound speeds m second",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSoundSpeedsMSecond.forEach((v) =>
    positive(v, "observedSoundSpeedsMSecond"),
  );
  input.observedSoundProfileDepthM.forEach((v) =>
    nonnegative(v, "observedSoundProfileDepthM"),
  );
  const e = extrema(
    input.observedSoundProfileDepthM,
    input.observedSoundSpeedsMSecond,
    false,
  );
  return {
    sampledSofarMinimumDepthsM: e.coordinates,
    minimumObservedSoundSpeedMSecond: e.value,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSoundProfileDepthM: [0, 100, 200],
  observedSoundSpeedsMSecond: [1500, 1480, 1480],
} satisfies Input;
export const exampleOutput = {
  sampledSofarMinimumDepthsM: [100, 200],
  minimumObservedSoundSpeedMSecond: 1480,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/sofar-axis-depth-lookup",
  title: "SOFAR Axis Depth Lookup",
  description:
    "Actual sampled sound-speed minima/ties only, no geographic axis table or interpolation to a unique duct center. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "sampledSofarMinimumDepthsM",
      label: "Sampled sofar minimum depths m",
      kind: "numberList",
    },
    {
      id: "minimumObservedSoundSpeedMSecond",
      label: "Minimum observed sound speed m second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSoundProfileDepthM:
        value.observedSoundProfileDepthM as readonly number[],
      observedSoundSpeedsMSecond:
        value.observedSoundSpeedsMSecond as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
