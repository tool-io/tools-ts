import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedGrossSalvageBidsMinor: readonly number[];
  readonly observedSalvageDisposalCostsMinor: readonly number[];
  readonly callerIndependentlyEstablishedVehicleAcvMinor: number;
}>;
export type Output = Readonly<{
  readonly netSalvageRecoveryMinorByBid: readonly number[];
  readonly netSalvageRecoveryPercentOfAcv: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGrossSalvageBidsMinor",
    label: "Observed gross salvage bids minor",
    kind: "numberList",
  },
  {
    id: "observedSalvageDisposalCostsMinor",
    label: "Observed salvage disposal costs minor",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedVehicleAcvMinor",
    label: "Caller independently established vehicle acv minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedGrossSalvageBidsMinor,
    input.observedSalvageDisposalCostsMinor,
    "bids",
  );
  [
    ...input.observedGrossSalvageBidsMinor,
    ...input.observedSalvageDisposalCostsMinor,
    input.callerIndependentlyEstablishedVehicleAcvMinor,
  ].forEach((v) => money(v));
  positive(input.callerIndependentlyEstablishedVehicleAcvMinor, "acv");
  const net = input.observedGrossSalvageBidsMinor.map(
    (v, i) => v - input.observedSalvageDisposalCostsMinor[i],
  );
  return {
    netSalvageRecoveryMinorByBid: net,
    netSalvageRecoveryPercentOfAcv: net.map(
      (v) => (100 * v) / input.callerIndependentlyEstablishedVehicleAcvMinor,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGrossSalvageBidsMinor: [1000, 2000],
  observedSalvageDisposalCostsMinor: [100, 500],
  callerIndependentlyEstablishedVehicleAcvMinor: 10000,
} satisfies Input;
export const exampleOutput = {
  netSalvageRecoveryMinorByBid: [900, 1500],
  netSalvageRecoveryPercentOfAcv: [9, 15],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/salvage-title-recovery-value-percent",
  title: "Salvage Title Recovery Value Percent Calculator",
  description:
    "Compare actual salvage bids net of disposal cost against independently valued ACV, signed negative recovery retained; no salvage title law, universal recovery rate or legal sale eligibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "netSalvageRecoveryMinorByBid",
      label: "Net salvage recovery minor by bid",
      kind: "numberList",
    },
    {
      id: "netSalvageRecoveryPercentOfAcv",
      label: "Net salvage recovery percent of acv",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGrossSalvageBidsMinor:
        value.observedGrossSalvageBidsMinor as readonly number[],
      observedSalvageDisposalCostsMinor:
        value.observedSalvageDisposalCostsMinor as readonly number[],
      callerIndependentlyEstablishedVehicleAcvMinor:
        value.callerIndependentlyEstablishedVehicleAcvMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
