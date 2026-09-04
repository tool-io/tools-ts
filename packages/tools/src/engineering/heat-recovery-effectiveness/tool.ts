import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedHotInletK: number;
  readonly observedHotOutletK: number;
  readonly observedColdInletK: number;
  readonly observedColdOutletK: number;
  readonly callerHotCapacityWK: number;
  readonly callerColdCapacityWK: number;
}>;
export type Output = Readonly<{
  readonly hotRecoveredWatts: number;
  readonly coldRecoveredWatts: number;
  readonly signedEnergyClosureWatts: number;
  readonly coldSideRecoveryEffectiveness: number;
}>;
const inputFields = [
  { id: "observedHotInletK", label: "Observed hot inlet k", kind: "number" },
  { id: "observedHotOutletK", label: "Observed hot outlet k", kind: "number" },
  { id: "observedColdInletK", label: "Observed cold inlet k", kind: "number" },
  {
    id: "observedColdOutletK",
    label: "Observed cold outlet k",
    kind: "number",
  },
  {
    id: "callerHotCapacityWK",
    label: "Caller hot capacity w k",
    kind: "number",
  },
  {
    id: "callerColdCapacityWK",
    label: "Caller cold capacity w k",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedHotInletK, "observedHotInletK");
  positive(input.observedHotOutletK, "observedHotOutletK");
  positive(input.observedColdInletK, "observedColdInletK");
  positive(input.observedColdOutletK, "observedColdOutletK");
  positive(input.callerHotCapacityWK, "callerHotCapacityWK");
  positive(input.callerColdCapacityWK, "callerColdCapacityWK");
  const delta = input.observedHotInletK - input.observedColdInletK;
  positive(delta, "inlet driving difference");
  const hot =
      input.callerHotCapacityWK *
      (input.observedHotInletK - input.observedHotOutletK),
    cold =
      input.callerColdCapacityWK *
      (input.observedColdOutletK - input.observedColdInletK);
  return {
    hotRecoveredWatts: hot,
    coldRecoveredWatts: cold,
    signedEnergyClosureWatts: hot - cold,
    coldSideRecoveryEffectiveness:
      cold /
      (Math.min(input.callerHotCapacityWK, input.callerColdCapacityWK) * delta),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHotInletK: 320,
  observedHotOutletK: 300,
  observedColdInletK: 280,
  observedColdOutletK: 300,
  callerHotCapacityWK: 2,
  callerColdCapacityWK: 1,
} satisfies Input;
export const exampleOutput = {
  hotRecoveredWatts: 40,
  coldRecoveredWatts: 20,
  signedEnergyClosureWatts: 20,
  coldSideRecoveryEffectiveness: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/heat-recovery-effectiveness",
  title: "Heat Recovery Effectiveness Calculator",
  description:
    "Audit actual paired inlet/outlet heat-recovery sides and closure before reporting cold-side effectiveness; unequal energy sides retained. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "hotRecoveredWatts", label: "Hot recovered watts", kind: "number" },
    { id: "coldRecoveredWatts", label: "Cold recovered watts", kind: "number" },
    {
      id: "signedEnergyClosureWatts",
      label: "Signed energy closure watts",
      kind: "number",
    },
    {
      id: "coldSideRecoveryEffectiveness",
      label: "Cold side recovery effectiveness",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHotInletK: value.observedHotInletK as number,
      observedHotOutletK: value.observedHotOutletK as number,
      observedColdInletK: value.observedColdInletK as number,
      observedColdOutletK: value.observedColdOutletK as number,
      callerHotCapacityWK: value.callerHotCapacityWK as number,
      callerColdCapacityWK: value.callerColdCapacityWK as number,
    }),
});
export const run = tool.execute;
export default tool;
