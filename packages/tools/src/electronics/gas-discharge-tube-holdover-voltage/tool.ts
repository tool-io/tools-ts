import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedRecoveryVoltageV: number;
  readonly callerRatedHoldoverVoltageV: number;
  readonly callerObservedFollowCurrentA: number;
  readonly callerFollowCurrentConditionLimitA: number;
  readonly ratingAppliesToCallerWaveform: boolean;
}>;
export type Output = Readonly<{
  readonly signedHoldoverVoltageMarginV: number;
  readonly withinSuppliedHoldoverEvidence: boolean;
}>;
const inputFields = [
  {
    id: "observedRecoveryVoltageV",
    label: "Observed recovery voltage v",
    kind: "number",
  },
  {
    id: "callerRatedHoldoverVoltageV",
    label: "Caller rated holdover voltage v",
    kind: "number",
  },
  {
    id: "callerObservedFollowCurrentA",
    label: "Caller observed follow current a",
    kind: "number",
  },
  {
    id: "callerFollowCurrentConditionLimitA",
    label: "Caller follow current condition limit a",
    kind: "number",
  },
  {
    id: "ratingAppliesToCallerWaveform",
    label: "Rating applies to caller waveform",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerRatedHoldoverVoltageV, "callerRatedHoldoverVoltageV");
  positive(
    input.callerFollowCurrentConditionLimitA,
    "callerFollowCurrentConditionLimitA",
  );
  nonnegative(input.observedRecoveryVoltageV, "observedRecoveryVoltageV");
  nonnegative(
    input.callerObservedFollowCurrentA,
    "callerObservedFollowCurrentA",
  );
  return {
    signedHoldoverVoltageMarginV:
      input.callerRatedHoldoverVoltageV - input.observedRecoveryVoltageV,
    withinSuppliedHoldoverEvidence:
      input.ratingAppliesToCallerWaveform &&
      input.observedRecoveryVoltageV <= input.callerRatedHoldoverVoltageV &&
      input.callerObservedFollowCurrentA <=
        input.callerFollowCurrentConditionLimitA,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRecoveryVoltageV: 80,
  callerRatedHoldoverVoltageV: 100,
  callerObservedFollowCurrentA: 0.1,
  callerFollowCurrentConditionLimitA: 0.2,
  ratingAppliesToCallerWaveform: true,
} satisfies Input;
export const exampleOutput = {
  signedHoldoverVoltageMarginV: 20,
  withinSuppliedHoldoverEvidence: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/gas-discharge-tube-holdover-voltage",
  title: "Gas Discharge Tube Holdover Voltage Calculator",
  description:
    "Audit recovery voltage/follow current against caller GDT holdover rating and explicit waveform applicability; does not predict extinction from sparkover or establish safe surge protection.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedHoldoverVoltageMarginV",
      label: "Signed holdover voltage margin v",
      kind: "number",
    },
    {
      id: "withinSuppliedHoldoverEvidence",
      label: "Within supplied holdover evidence",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRecoveryVoltageV: value.observedRecoveryVoltageV as number,
      callerRatedHoldoverVoltageV: value.callerRatedHoldoverVoltageV as number,
      callerObservedFollowCurrentA:
        value.callerObservedFollowCurrentA as number,
      callerFollowCurrentConditionLimitA:
        value.callerFollowCurrentConditionLimitA as number,
      ratingAppliesToCallerWaveform:
        value.ratingAppliesToCallerWaveform as boolean,
    }),
});
export const run = tool.execute;
export default tool;
