import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedCltPanelDepthM: number;
  readonly callerVerifiedCharRateMMinute: number;
  readonly callerIndependentZeroStrengthLayerM: number;
  readonly elapsedFireMinutes: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerRemainingEffectivePanelDepthM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCltPanelDepthM",
    label: "Observed clt panel depth m",
    kind: "number",
  },
  {
    id: "callerVerifiedCharRateMMinute",
    label: "Caller verified char rate m minute",
    kind: "number",
  },
  {
    id: "callerIndependentZeroStrengthLayerM",
    label: "Caller independent zero strength layer m",
    kind: "number",
  },
  {
    id: "elapsedFireMinutes",
    label: "Elapsed fire minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedCltPanelDepthM, "observedCltPanelDepthM");
  nonnegative(
    input.callerVerifiedCharRateMMinute,
    "callerVerifiedCharRateMMinute",
  );
  nonnegative(
    input.callerIndependentZeroStrengthLayerM,
    "callerIndependentZeroStrengthLayerM",
  );
  input.elapsedFireMinutes.forEach((v) => nonnegative(v, "elapsedFireMinutes"));
  return {
    callerRemainingEffectivePanelDepthM: input.elapsedFireMinutes.map(
      (t) =>
        input.observedCltPanelDepthM -
        input.callerVerifiedCharRateMMinute * t -
        input.callerIndependentZeroStrengthLayerM,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCltPanelDepthM: 0.2,
  callerVerifiedCharRateMMinute: 0.001,
  callerIndependentZeroStrengthLayerM: 0.01,
  elapsedFireMinutes: [0, 10, 20],
} satisfies Input;
export const exampleOutput = {
  callerRemainingEffectivePanelDepthM: [0.19, 0.18, 0.17],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/clt-fire-resistance",
  title: "CLT Fire Resistance Calculator",
  description:
    "Explicit one-face continuous char-depth accounting with independent zero-strength allowance, signed lost-section retained; not CLT bond-line falloff, residual bending capacity or fire rating. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRemainingEffectivePanelDepthM",
      label: "Caller remaining effective panel depth m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCltPanelDepthM: value.observedCltPanelDepthM as number,
      callerVerifiedCharRateMMinute:
        value.callerVerifiedCharRateMMinute as number,
      callerIndependentZeroStrengthLayerM:
        value.callerIndependentZeroStrengthLayerM as number,
      elapsedFireMinutes: value.elapsedFireMinutes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
