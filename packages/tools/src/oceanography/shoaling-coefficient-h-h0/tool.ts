import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly referenceWaveHeightM: number;
  readonly referenceGroupSpeedMPerSecond: number;
  readonly localGroupSpeedMPerSecond: number;
  readonly retainedEnergyFluxFraction: number;
}>;
export type Output = Readonly<{
  readonly shoalingHeightCoefficient: number;
  readonly localWaveHeightM: number;
}>;
const inputFields = [
  {
    id: "referenceWaveHeightM",
    label: "Reference wave height m",
    kind: "number",
  },
  {
    id: "referenceGroupSpeedMPerSecond",
    label: "Reference group speed m per second",
    kind: "number",
  },
  {
    id: "localGroupSpeedMPerSecond",
    label: "Local group speed m per second",
    kind: "number",
  },
  {
    id: "retainedEnergyFluxFraction",
    label: "Retained energy flux fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.referenceGroupSpeedMPerSecond,
    "referenceGroupSpeedMPerSecond",
  );
  positive(input.localGroupSpeedMPerSecond, "localGroupSpeedMPerSecond");
  nonnegative(input.referenceWaveHeightM, "referenceWaveHeightM");
  fraction(input.retainedEnergyFluxFraction, "retainedEnergyFluxFraction");
  const shoalingHeightCoefficient = Math.sqrt(
    (input.referenceGroupSpeedMPerSecond / input.localGroupSpeedMPerSecond) *
      input.retainedEnergyFluxFraction,
  );
  return {
    shoalingHeightCoefficient,
    localWaveHeightM: input.referenceWaveHeightM * shoalingHeightCoefficient,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceWaveHeightM: 0.5,
  referenceGroupSpeedMPerSecond: 8,
  localGroupSpeedMPerSecond: 2,
  retainedEnergyFluxFraction: 0.81,
} satisfies Input;
export const exampleOutput = {
  shoalingHeightCoefficient: 1.8,
  localWaveHeightM: 0.9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/shoaling-coefficient-h-h0",
  title: "Shoaling Coefficient H H0",
  description:
    "Transform wave height by supplied group speeds and retained energy flux on constant-width rays; no refraction or breaking correction is silently included.",
  inputs: inputFields,
  outputs: [
    {
      id: "shoalingHeightCoefficient",
      label: "Shoaling height coefficient",
      kind: "number",
    },
    { id: "localWaveHeightM", label: "Local wave height m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      referenceWaveHeightM: value.referenceWaveHeightM as number,
      referenceGroupSpeedMPerSecond:
        value.referenceGroupSpeedMPerSecond as number,
      localGroupSpeedMPerSecond: value.localGroupSpeedMPerSecond as number,
      retainedEnergyFluxFraction: value.retainedEnergyFluxFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
