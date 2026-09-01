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
  readonly callerDwellingCoverageMinor: number;
  readonly callerOrdinanceUpgradeBasisPoints: number;
  readonly callerIndependentlyCoveredUpgradeCostsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerOrdinanceUpgradeLimitMinor: number;
  readonly totalCallerCoveredUpgradeMinor: number;
  readonly upgradeCostAboveCallerLimitMinor: number;
}>;
const inputFields = [
  {
    id: "callerDwellingCoverageMinor",
    label: "Caller dwelling coverage minor",
    kind: "number",
  },
  {
    id: "callerOrdinanceUpgradeBasisPoints",
    label: "Caller ordinance upgrade basis points",
    kind: "number",
  },
  {
    id: "callerIndependentlyCoveredUpgradeCostsMinor",
    label: "Caller independently covered upgrade costs minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerDwellingCoverageMinor);
  input.callerIndependentlyCoveredUpgradeCostsMinor.forEach((v) => money(v));
  const limit = share(
      input.callerDwellingCoverageMinor,
      input.callerOrdinanceUpgradeBasisPoints,
    ),
    cost = sumMoney(input.callerIndependentlyCoveredUpgradeCostsMinor);
  return {
    callerOrdinanceUpgradeLimitMinor: limit,
    totalCallerCoveredUpgradeMinor: cost,
    upgradeCostAboveCallerLimitMinor: Math.max(0, cost - limit),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDwellingCoverageMinor: 100000,
  callerOrdinanceUpgradeBasisPoints: 2000,
  callerIndependentlyCoveredUpgradeCostsMinor: [10000, 15000],
} satisfies Input;
export const exampleOutput = {
  callerOrdinanceUpgradeLimitMinor: 20000,
  totalCallerCoveredUpgradeMinor: 25000,
  upgradeCostAboveCallerLimitMinor: 5000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/ordinance-or-law-upgrade-percent-lookup",
  title: "Ordinance Or Law Upgrade Percent Lookup",
  description:
    "Budget caller independently covered ordinance-upgrade line costs against explicit dwelling percentage sublimit; demolition/undamaged-part limits separate and no code/legal coverage finding.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerOrdinanceUpgradeLimitMinor",
      label: "Caller ordinance upgrade limit minor",
      kind: "number",
    },
    {
      id: "totalCallerCoveredUpgradeMinor",
      label: "Total caller covered upgrade minor",
      kind: "number",
    },
    {
      id: "upgradeCostAboveCallerLimitMinor",
      label: "Upgrade cost above caller limit minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDwellingCoverageMinor: value.callerDwellingCoverageMinor as number,
      callerOrdinanceUpgradeBasisPoints:
        value.callerOrdinanceUpgradeBasisPoints as number,
      callerIndependentlyCoveredUpgradeCostsMinor:
        value.callerIndependentlyCoveredUpgradeCostsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
