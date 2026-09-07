import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  strictlyIncreasing,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedRingResonanceWavelengthM: readonly number[];
  readonly callerVacuumSpeedMSecond: number;
}>;
export type Output = Readonly<{
  readonly observedRingWavelengthSpacingsM: readonly number[];
  readonly observedRingFrequencySpacingsHz: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRingResonanceWavelengthM",
    label: "Observed ring resonance wavelength m",
    kind: "numberList",
  },
  {
    id: "callerVacuumSpeedMSecond",
    label: "Caller vacuum speed m second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRingResonanceWavelengthM.forEach((v) =>
    positive(v, "observedRingResonanceWavelengthM"),
  );
  positive(input.callerVacuumSpeedMSecond, "callerVacuumSpeedMSecond");
  strictlyIncreasing(input.observedRingResonanceWavelengthM, "resonances");
  return {
    observedRingWavelengthSpacingsM: input.observedRingResonanceWavelengthM
      .slice(1)
      .map((v, i) => v - input.observedRingResonanceWavelengthM[i]),
    observedRingFrequencySpacingsHz: input.observedRingResonanceWavelengthM
      .slice(1)
      .map(
        (v, i) =>
          input.callerVacuumSpeedMSecond /
            input.observedRingResonanceWavelengthM[i] -
          input.callerVacuumSpeedMSecond / v,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRingResonanceWavelengthM: [1, 1.1, 1.3],
  callerVacuumSpeedMSecond: 300,
} satisfies Input;
export const exampleOutput = {
  observedRingWavelengthSpacingsM: [0.1, 0.2],
  observedRingFrequencySpacingsHz: [27.27272727272731, 41.95804195804192],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/silicon-photonics-ring-resonator-free-spectral-range",
  title:
    "Semiconductor Silicon Photonics Ring Resonator Free Spectral Range Calculator",
  description:
    "Audit consecutive measured ring resonances with exact wavelength/frequency spacings, not linewidth Q or a constant-wavelength FSR approximation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRingWavelengthSpacingsM",
      label: "Observed ring wavelength spacings m",
      kind: "numberList",
    },
    {
      id: "observedRingFrequencySpacingsHz",
      label: "Observed ring frequency spacings hz",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRingResonanceWavelengthM:
        value.observedRingResonanceWavelengthM as readonly number[],
      callerVacuumSpeedMSecond: value.callerVacuumSpeedMSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
