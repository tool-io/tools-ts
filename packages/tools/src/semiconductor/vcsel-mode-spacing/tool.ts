import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  strictlyIncreasing,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedVcselLongitudinalResonanceHz: readonly number[];
  readonly callerSpeedOfLightMSecond: number;
  readonly callerMatchedGroupIndex: number;
}>;
export type Output = Readonly<{
  readonly observedModeSpacingHz: readonly number[];
  readonly inferredEffectiveCavityLengthsM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedVcselLongitudinalResonanceHz",
    label: "Observed vcsel longitudinal resonance hz",
    kind: "numberList",
  },
  {
    id: "callerSpeedOfLightMSecond",
    label: "Caller speed of light m second",
    kind: "number",
  },
  {
    id: "callerMatchedGroupIndex",
    label: "Caller matched group index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedVcselLongitudinalResonanceHz.forEach((v) =>
    positive(v, "observedVcselLongitudinalResonanceHz"),
  );
  positive(input.callerSpeedOfLightMSecond, "callerSpeedOfLightMSecond");
  positive(input.callerMatchedGroupIndex, "callerMatchedGroupIndex");
  strictlyIncreasing(input.observedVcselLongitudinalResonanceHz, "modes");
  const spacing = input.observedVcselLongitudinalResonanceHz
    .slice(1)
    .map((v, i) => v - input.observedVcselLongitudinalResonanceHz[i]);
  return {
    observedModeSpacingHz: spacing,
    inferredEffectiveCavityLengthsM: spacing.map(
      (v) =>
        input.callerSpeedOfLightMSecond / 2 / input.callerMatchedGroupIndex / v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedVcselLongitudinalResonanceHz: [10, 12, 15],
  callerSpeedOfLightMSecond: 300,
  callerMatchedGroupIndex: 3,
} satisfies Input;
export const exampleOutput = {
  observedModeSpacingHz: [2, 3],
  inferredEffectiveCavityLengthsM: [25, 16.666666666666668],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/vcsel-mode-spacing",
  title: "Semiconductor Vcsel Mode Spacing Calculator",
  description:
    "Audit actual VCSEL consecutive longitudinal-mode spacings and infer matched effective optical cavity length, not geometric FSR forward formula or transverse-mode selection.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedModeSpacingHz",
      label: "Observed mode spacing hz",
      kind: "numberList",
    },
    {
      id: "inferredEffectiveCavityLengthsM",
      label: "Inferred effective cavity lengths m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedVcselLongitudinalResonanceHz:
        value.observedVcselLongitudinalResonanceHz as readonly number[],
      callerSpeedOfLightMSecond: value.callerSpeedOfLightMSecond as number,
      callerMatchedGroupIndex: value.callerMatchedGroupIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
