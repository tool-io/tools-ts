import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sumMoney,
  money,
  share,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerGrossWrittenPremiumMinor: number;
  readonly callerIndependentlyCoveredGrossLossMinor: number;
  readonly callerQuotaShareCededBasisPoints: number;
  readonly callerCedingCommissionBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly callerCededPremiumMinor: number;
  readonly callerCedingCommissionMinor: number;
  readonly callerNetRetainedPremiumMinor: number;
  readonly callerCededLossMinor: number;
  readonly callerRetainedLossMinor: number;
}>;
const inputFields = [
  {
    id: "callerGrossWrittenPremiumMinor",
    label: "Caller gross written premium minor",
    kind: "number",
  },
  {
    id: "callerIndependentlyCoveredGrossLossMinor",
    label: "Caller independently covered gross loss minor",
    kind: "number",
  },
  {
    id: "callerQuotaShareCededBasisPoints",
    label: "Caller quota share ceded basis points",
    kind: "number",
  },
  {
    id: "callerCedingCommissionBasisPoints",
    label: "Caller ceding commission basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerGrossWrittenPremiumMinor);
  money(input.callerIndependentlyCoveredGrossLossMinor);
  bounded(input.callerQuotaShareCededBasisPoints, "share", 0, 10000);
  bounded(input.callerCedingCommissionBasisPoints, "commission", 0, 10000);
  const ceded = share(
      input.callerGrossWrittenPremiumMinor,
      input.callerQuotaShareCededBasisPoints,
    ),
    commission = share(ceded, input.callerCedingCommissionBasisPoints),
    loss = share(
      input.callerIndependentlyCoveredGrossLossMinor,
      input.callerQuotaShareCededBasisPoints,
    );
  return {
    callerCededPremiumMinor: ceded,
    callerCedingCommissionMinor: commission,
    callerNetRetainedPremiumMinor: sumMoney([
      input.callerGrossWrittenPremiumMinor - ceded,
      commission,
    ]),
    callerCededLossMinor: loss,
    callerRetainedLossMinor:
      input.callerIndependentlyCoveredGrossLossMinor - loss,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerGrossWrittenPremiumMinor: 10000,
  callerIndependentlyCoveredGrossLossMinor: 8000,
  callerQuotaShareCededBasisPoints: 4000,
  callerCedingCommissionBasisPoints: 2500,
} satisfies Input;
export const exampleOutput = {
  callerCededPremiumMinor: 4000,
  callerCedingCommissionMinor: 1000,
  callerNetRetainedPremiumMinor: 7000,
  callerCededLossMinor: 3200,
  callerRetainedLossMinor: 4800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/quota-share-ceding-commission-net-retained",
  title: "Quota Share Ceding Commission Net Retained Calculator",
  description:
    "Reconcile actual quota-share premium/loss and commission on ceded premium, exact separate money rounding; no retrocession attachment waterfall, treaty wording, profit commission or tax/accounting approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCededPremiumMinor",
      label: "Caller ceded premium minor",
      kind: "number",
    },
    {
      id: "callerCedingCommissionMinor",
      label: "Caller ceding commission minor",
      kind: "number",
    },
    {
      id: "callerNetRetainedPremiumMinor",
      label: "Caller net retained premium minor",
      kind: "number",
    },
    {
      id: "callerCededLossMinor",
      label: "Caller ceded loss minor",
      kind: "number",
    },
    {
      id: "callerRetainedLossMinor",
      label: "Caller retained loss minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerGrossWrittenPremiumMinor:
        value.callerGrossWrittenPremiumMinor as number,
      callerIndependentlyCoveredGrossLossMinor:
        value.callerIndependentlyCoveredGrossLossMinor as number,
      callerQuotaShareCededBasisPoints:
        value.callerQuotaShareCededBasisPoints as number,
      callerCedingCommissionBasisPoints:
        value.callerCedingCommissionBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
