import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly excitationCenterMs: number;
  readonly refocusingCenterMs: number;
  readonly adcEchoCenterMs: number;
  readonly absoluteToleranceMs: number;
}>;
export type Output = Readonly<{
  readonly idealEchoTimeMs: number;
  readonly observedEchoTimeMs: number;
  readonly centerMismatchMs: number;
  readonly withinTolerance: boolean;
}>;
const inputFields = [
  {
    id: "excitationCenterMs",
    label: "Excitation center ms",
    kind: "number",
    unit: "ms",
  },
  {
    id: "refocusingCenterMs",
    label: "Refocusing center ms",
    kind: "number",
    unit: "ms",
  },
  {
    id: "adcEchoCenterMs",
    label: "Adc echo center ms",
    kind: "number",
    unit: "ms",
  },
  {
    id: "absoluteToleranceMs",
    label: "Absolute tolerance ms",
    kind: "number",
    unit: "ms",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.refocusingCenterMs - input.excitationCenterMs,
    "refocusingCenterMs",
  );
  positive(input.adcEchoCenterMs - input.refocusingCenterMs, "adcEchoCenterMs");
  nonnegative(input.absoluteToleranceMs, "absoluteToleranceMs");
  const idealEchoTimeMs =
      2 * (input.refocusingCenterMs - input.excitationCenterMs),
    observedEchoTimeMs = input.adcEchoCenterMs - input.excitationCenterMs,
    centerMismatchMs = observedEchoTimeMs - idealEchoTimeMs;
  return {
    idealEchoTimeMs,
    observedEchoTimeMs,
    centerMismatchMs,
    withinTolerance: Math.abs(centerMismatchMs) <= input.absoluteToleranceMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  excitationCenterMs: 0,
  refocusingCenterMs: 40,
  adcEchoCenterMs: 81,
  absoluteToleranceMs: 0.5,
} satisfies Input;
export const exampleOutput = {
  idealEchoTimeMs: 80,
  observedEchoTimeMs: 81,
  centerMismatchMs: 1,
  withinTolerance: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/spin-echo-center-timing-audit",
  title: "Echo Time TE",
  description:
    "Audit ideal Hahn-echo center timing against a supplied ADC echo center; finite pulse widths, gradient echoes and off-resonance phase are not solved.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealEchoTimeMs",
      label: "Ideal echo time ms",
      kind: "number",
      unit: "ms",
    },
    {
      id: "observedEchoTimeMs",
      label: "Observed echo time ms",
      kind: "number",
      unit: "ms",
    },
    {
      id: "centerMismatchMs",
      label: "Center mismatch ms",
      kind: "number",
      unit: "ms",
    },
    { id: "withinTolerance", label: "Within tolerance", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      excitationCenterMs: value.excitationCenterMs as number,
      refocusingCenterMs: value.refocusingCenterMs as number,
      adcEchoCenterMs: value.adcEchoCenterMs as number,
      absoluteToleranceMs: value.absoluteToleranceMs as number,
    }),
});
export const run = tool.execute;
export default tool;
