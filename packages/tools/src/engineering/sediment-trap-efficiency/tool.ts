import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedUpstreamSedimentKg: readonly number[];
  readonly observedDownstreamSedimentKg: readonly number[];
  readonly callerIndependentlyMeasuredStorageChangeKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedDeliveryTrapEfficiency: number;
  readonly signedSedimentBalanceResidualKg: number;
}>;
const inputFields = [
  {
    id: "observedUpstreamSedimentKg",
    label: "Observed upstream sediment kg",
    kind: "numberList",
  },
  {
    id: "observedDownstreamSedimentKg",
    label: "Observed downstream sediment kg",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMeasuredStorageChangeKg",
    label: "Caller independently measured storage change kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedUpstreamSedimentKg.forEach((v) =>
    nonnegative(v, "observedUpstreamSedimentKg"),
  );
  input.observedDownstreamSedimentKg.forEach((v) =>
    nonnegative(v, "observedDownstreamSedimentKg"),
  );
  aligned(
    input.observedUpstreamSedimentKg,
    input.observedDownstreamSedimentKg,
    "observedUpstreamSedimentKg",
  );
  aligned(
    input.observedUpstreamSedimentKg,
    input.callerIndependentlyMeasuredStorageChangeKg,
    "observedUpstreamSedimentKg",
  );
  const inlet = sum(input.observedUpstreamSedimentKg);
  positive(inlet, "measured inlet mass");
  const caught = inlet - sum(input.observedDownstreamSedimentKg);
  return {
    observedDeliveryTrapEfficiency: caught / inlet,
    signedSedimentBalanceResidualKg:
      caught - sum(input.callerIndependentlyMeasuredStorageChangeKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUpstreamSedimentKg: [10, 20],
  observedDownstreamSedimentKg: [5, 15],
  callerIndependentlyMeasuredStorageChangeKg: [1, -1],
} satisfies Input;
export const exampleOutput = {
  observedDeliveryTrapEfficiency: 0.3333333333333333,
  signedSedimentBalanceResidualKg: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/sediment-trap-efficiency",
  title: "Sediment Trap Efficiency Calculator",
  description:
    "Matched actual upstream/downstream sediment and independent storage-change closure, apparent negative retention retained, not a reservoir efficiency-size empirical curve. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDeliveryTrapEfficiency",
      label: "Observed delivery trap efficiency",
      kind: "number",
    },
    {
      id: "signedSedimentBalanceResidualKg",
      label: "Signed sediment balance residual kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUpstreamSedimentKg:
        value.observedUpstreamSedimentKg as readonly number[],
      observedDownstreamSedimentKg:
        value.observedDownstreamSedimentKg as readonly number[],
      callerIndependentlyMeasuredStorageChangeKg:
        value.callerIndependentlyMeasuredStorageChangeKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
