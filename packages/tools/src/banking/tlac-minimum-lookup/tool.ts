import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
  sumMoney,
  weightedMinor,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedCallerEligibleTlacComponentsMinor: readonly number[];
  readonly callerEligibleTlacFlags: readonly number[];
  readonly callerRiskWeightedAssetsMinor: number;
  readonly callerLeverageExposureMinor: number;
  readonly callerRwaRequirementBps: number;
  readonly callerExposureRequirementBps: number;
}>;
export type Output = Readonly<{
  readonly eligibleTlacMinor: number;
  readonly callerRwaRequiredMinor: number;
  readonly callerExposureRequiredMinor: number;
  readonly callerBindingRequirementMinor: number;
  readonly signedTlacSurplusMinor: number;
}>;
const inputFields = [
  {
    id: "observedCallerEligibleTlacComponentsMinor",
    label: "Observed caller eligible tlac components minor",
    kind: "numberList",
  },
  {
    id: "callerEligibleTlacFlags",
    label: "Caller eligible tlac flags",
    kind: "numberList",
  },
  {
    id: "callerRiskWeightedAssetsMinor",
    label: "Caller risk weighted assets minor",
    kind: "number",
  },
  {
    id: "callerLeverageExposureMinor",
    label: "Caller leverage exposure minor",
    kind: "number",
  },
  {
    id: "callerRwaRequirementBps",
    label: "Caller rwa requirement bps",
    kind: "number",
  },
  {
    id: "callerExposureRequirementBps",
    label: "Caller exposure requirement bps",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedCallerEligibleTlacComponentsMinor,
    input.callerEligibleTlacFlags,
    "TLAC",
  );
  binary(input.callerEligibleTlacFlags, "eligible");
  input.observedCallerEligibleTlacComponentsMinor.forEach((v) => money(v));
  money(input.callerRiskWeightedAssetsMinor);
  money(input.callerLeverageExposureMinor);
  bounded(input.callerRwaRequirementBps, "rwa bps", 0, 10000);
  bounded(input.callerExposureRequirementBps, "exposure bps", 0, 10000);
  const eligible = sumMoney(
      input.observedCallerEligibleTlacComponentsMinor.filter(
        (_, i) => input.callerEligibleTlacFlags[i],
      ),
    ),
    rwa = weightedMinor(
      input.callerRiskWeightedAssetsMinor,
      input.callerRwaRequirementBps,
      10000,
    ),
    leverage = weightedMinor(
      input.callerLeverageExposureMinor,
      input.callerExposureRequirementBps,
      10000,
    ),
    binding = Math.max(rwa, leverage);
  return {
    eligibleTlacMinor: eligible,
    callerRwaRequiredMinor: rwa,
    callerExposureRequiredMinor: leverage,
    callerBindingRequirementMinor: binding,
    signedTlacSurplusMinor: eligible - binding,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCallerEligibleTlacComponentsMinor: [100, 200],
  callerEligibleTlacFlags: [1, 0],
  callerRiskWeightedAssetsMinor: 1000,
  callerLeverageExposureMinor: 2000,
  callerRwaRequirementBps: 1500,
  callerExposureRequirementBps: 600,
} satisfies Input;
export const exampleOutput = {
  eligibleTlacMinor: 100,
  callerRwaRequiredMinor: 150,
  callerExposureRequiredMinor: 120,
  callerBindingRequirementMinor: 150,
  signedTlacSurplusMinor: -50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/tlac-minimum-lookup",
  title: "TLAC Minimum Requirement Lookup",
  description:
    "Budget caller verified dual RWA/leverage TLAC requirements against eligible inventory, maxima not summed thresholds; no fixed global minimum or resolution adequacy. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    { id: "eligibleTlacMinor", label: "Eligible tlac minor", kind: "number" },
    {
      id: "callerRwaRequiredMinor",
      label: "Caller rwa required minor",
      kind: "number",
    },
    {
      id: "callerExposureRequiredMinor",
      label: "Caller exposure required minor",
      kind: "number",
    },
    {
      id: "callerBindingRequirementMinor",
      label: "Caller binding requirement minor",
      kind: "number",
    },
    {
      id: "signedTlacSurplusMinor",
      label: "Signed tlac surplus minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCallerEligibleTlacComponentsMinor:
        value.observedCallerEligibleTlacComponentsMinor as readonly number[],
      callerEligibleTlacFlags:
        value.callerEligibleTlacFlags as readonly number[],
      callerRiskWeightedAssetsMinor:
        value.callerRiskWeightedAssetsMinor as number,
      callerLeverageExposureMinor: value.callerLeverageExposureMinor as number,
      callerRwaRequirementBps: value.callerRwaRequirementBps as number,
      callerExposureRequirementBps:
        value.callerExposureRequirementBps as number,
    }),
});
export const run = tool.execute;
export default tool;
