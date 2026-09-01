import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  sumMoney,
  money,
  share,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyEstablishedAcvMinor: number;
  readonly observedRepairEstimateMinor: number;
  readonly observedSalvageBidMinor: number;
  readonly callerTotalLossThresholdBasisPoints: number;
  readonly callerIncludeSalvageInThreshold: boolean;
}>;
export type Output = Readonly<{
  readonly callerThresholdMinor: number;
  readonly observedComparisonAmountMinor: number;
  readonly callerTotalLossThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "callerIndependentlyEstablishedAcvMinor",
    label: "Caller independently established acv minor",
    kind: "number",
  },
  {
    id: "observedRepairEstimateMinor",
    label: "Observed repair estimate minor",
    kind: "number",
  },
  {
    id: "observedSalvageBidMinor",
    label: "Observed salvage bid minor",
    kind: "number",
  },
  {
    id: "callerTotalLossThresholdBasisPoints",
    label: "Caller total loss threshold basis points",
    kind: "number",
  },
  {
    id: "callerIncludeSalvageInThreshold",
    label: "Caller include salvage in threshold",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.callerIndependentlyEstablishedAcvMinor,
    input.observedRepairEstimateMinor,
    input.observedSalvageBidMinor,
  ].forEach((v) => money(v));
  const threshold = share(
      input.callerIndependentlyEstablishedAcvMinor,
      input.callerTotalLossThresholdBasisPoints,
    ),
    amount = sumMoney([
      input.observedRepairEstimateMinor,
      input.callerIncludeSalvageInThreshold ? input.observedSalvageBidMinor : 0,
    ]);
  return {
    callerThresholdMinor: threshold,
    observedComparisonAmountMinor: amount,
    callerTotalLossThresholdReached: amount >= threshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentlyEstablishedAcvMinor: 10000,
  observedRepairEstimateMinor: 6000,
  observedSalvageBidMinor: 2000,
  callerTotalLossThresholdBasisPoints: 7500,
  callerIncludeSalvageInThreshold: true,
} satisfies Input;
export const exampleOutput = {
  callerThresholdMinor: 7500,
  observedComparisonAmountMinor: 8000,
  callerTotalLossThresholdReached: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/total-loss-acv-vs-repair-threshold-checker",
  title: "Total Loss ACV vs Repair Threshold Checker",
  description:
    "Audit actual repair/ACV/salvage evidence under caller explicit threshold and salvage-inclusion policy; not a legal total-loss determination, vehicle valuation or title classification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerThresholdMinor",
      label: "Caller threshold minor",
      kind: "number",
    },
    {
      id: "observedComparisonAmountMinor",
      label: "Observed comparison amount minor",
      kind: "number",
    },
    {
      id: "callerTotalLossThresholdReached",
      label: "Caller total loss threshold reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentlyEstablishedAcvMinor:
        value.callerIndependentlyEstablishedAcvMinor as number,
      observedRepairEstimateMinor: value.observedRepairEstimateMinor as number,
      observedSalvageBidMinor: value.observedSalvageBidMinor as number,
      callerTotalLossThresholdBasisPoints:
        value.callerTotalLossThresholdBasisPoints as number,
      callerIncludeSalvageInThreshold:
        value.callerIncludeSalvageInThreshold as boolean,
    }),
});
export const run = tool.execute;
export default tool;
