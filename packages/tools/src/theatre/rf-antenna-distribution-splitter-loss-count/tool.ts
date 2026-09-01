import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedRfChainInsertionLossesDb: readonly number[];
  readonly independentCableLossDb: number;
  readonly measuredReceiverInputBeforeDistributionDbm: number;
  readonly callerReceiverMinimumDbm: number;
}>;
export type Output = Readonly<{
  readonly totalRfDistributionLossDb: number;
  readonly estimatedReceiverAfterDistributionDbm: number;
  readonly signedReceiverMarginDb: number;
}>;
const inputFields = [
  {
    id: "observedRfChainInsertionLossesDb",
    label: "Observed rf chain insertion losses db",
    kind: "numberList",
  },
  {
    id: "independentCableLossDb",
    label: "Independent cable loss db",
    kind: "number",
  },
  {
    id: "measuredReceiverInputBeforeDistributionDbm",
    label: "Measured receiver input before distribution dbm",
    kind: "number",
  },
  {
    id: "callerReceiverMinimumDbm",
    label: "Caller receiver minimum dbm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRfChainInsertionLossesDb.forEach((v) =>
    nonnegative(v, "observedRfChainInsertionLossesDb"),
  );
  nonnegative(input.independentCableLossDb, "independentCableLossDb");
  const loss =
      sum(input.observedRfChainInsertionLossesDb) +
      input.independentCableLossDb,
    after = input.measuredReceiverInputBeforeDistributionDbm - loss;
  return {
    totalRfDistributionLossDb: loss,
    estimatedReceiverAfterDistributionDbm: after,
    signedReceiverMarginDb: after - input.callerReceiverMinimumDbm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRfChainInsertionLossesDb: [3, 3, 1],
  independentCableLossDb: 2,
  measuredReceiverInputBeforeDistributionDbm: -40,
  callerReceiverMinimumDbm: -50,
} satisfies Input;
export const exampleOutput = {
  totalRfDistributionLossDb: 9,
  estimatedReceiverAfterDistributionDbm: -49,
  signedReceiverMarginDb: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/rf-antenna-distribution-splitter-loss-count",
  title: "RF Antenna Distribution Splitter Loss Count Tool",
  description:
    "Reconcile actual series RF distribution/cable insertion-loss chain to measured input margin; no fictitious 3dB-per-split assumption, antenna gain, intermodulation/frequency coordination or RF guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalRfDistributionLossDb",
      label: "Total rf distribution loss db",
      kind: "number",
    },
    {
      id: "estimatedReceiverAfterDistributionDbm",
      label: "Estimated receiver after distribution dbm",
      kind: "number",
    },
    {
      id: "signedReceiverMarginDb",
      label: "Signed receiver margin db",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRfChainInsertionLossesDb:
        value.observedRfChainInsertionLossesDb as readonly number[],
      independentCableLossDb: value.independentCableLossDb as number,
      measuredReceiverInputBeforeDistributionDbm:
        value.measuredReceiverInputBeforeDistributionDbm as number,
      callerReceiverMinimumDbm: value.callerReceiverMinimumDbm as number,
    }),
});
export const run = tool.execute;
export default tool;
