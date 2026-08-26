import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnmetNeedContraceptionPercentInput = {
  readonly womenWithUnmetNeed: number;
  readonly marriedWomenReproductiveAge: number;
  readonly contraceptivePrevalencePercent?: number;
};

export type UnmetNeedContraceptionPercentOutput = {
  readonly unmetNeedPercent: number;
  readonly totalDemandPercent: number;
  readonly demandSatisfiedPercent: number;
};

export const calculateUnmetNeedContraceptionPercent = (
  input: UnmetNeedContraceptionPercentInput,
): UnmetNeedContraceptionPercentOutput => {
  if (!(input.womenWithUnmetNeed >= 0))
    return simpleError(
      "womenWithUnmetNeed",
      "The count of women with unmet need must be non-negative.",
      "invalid_count",
    );
  if (!(input.marriedWomenReproductiveAge > 0))
    return simpleError(
      "marriedWomenReproductiveAge",
      "The base of married women of reproductive age must be greater than zero.",
      "invalid_base",
    );
  if (input.womenWithUnmetNeed > input.marriedWomenReproductiveAge)
    return simpleError(
      "womenWithUnmetNeed",
      "Women with unmet need cannot exceed the base population.",
      "invalid_count",
    );
  const contraceptivePrevalencePercent =
    input.contraceptivePrevalencePercent ?? 0;
  if (!(
    contraceptivePrevalencePercent >= 0 && contraceptivePrevalencePercent <= 100
  ))
    return simpleError(
      "contraceptivePrevalencePercent",
      "Contraceptive prevalence must lie between zero and one hundred percent.",
      "invalid_cpr",
    );
  const unmetNeedPercent =
    (input.womenWithUnmetNeed / input.marriedWomenReproductiveAge) * 100;
  const totalDemandPercent = unmetNeedPercent + contraceptivePrevalencePercent;
  if (totalDemandPercent > 100)
    return simpleError(
      "contraceptivePrevalencePercent",
      "Contraceptive prevalence plus unmet need cannot exceed one hundred percent of the same population base.",
      "invalid_demand",
    );
  return {
    unmetNeedPercent,
    totalDemandPercent,
    demandSatisfiedPercent:
      totalDemandPercent > 0
        ? (contraceptivePrevalencePercent / totalDemandPercent) * 100
        : 0,
  };
};

export const unmetNeedContraceptionPercentExample = {
  input: {
    womenWithUnmetNeed: 1200000,
    marriedWomenReproductiveAge: 10000000,
    contraceptivePrevalencePercent: 58,
  },
  output: {
    unmetNeedPercent: 12,
    totalDemandPercent: 70,
    demandSatisfiedPercent: 82.85714285714286,
  },
} satisfies ToolExample<
  UnmetNeedContraceptionPercentInput,
  UnmetNeedContraceptionPercentOutput
>;

export const unmetNeedContraceptionPercentTool = createSimpleTool({
  id: "demography/unmet-need-contraception-percent",
  title: "Unmet Need Contraception Percent",
  description:
    "Compute unmet need for contraception as a percent of married women of reproductive age, plus total demand (prevalence plus unmet need) and the share of demand satisfied by current use.",
  inputs: [
    {
      description:
        "Married women of reproductive age who want to stop or delay childbearing but use no method.",
      id: "womenWithUnmetNeed",
      kind: "number",
      label: "Unmet need",
      minimum: 0,
    },
    {
      description:
        "Total married women of reproductive age in the survey base.",
      id: "marriedWomenReproductiveAge",
      kind: "number",
      label: "Base MWRA",
      minimum: 0,
    },
    {
      default: 0,
      description:
        "Current contraceptive prevalence among the same base, in percent.",
      id: "contraceptivePrevalencePercent",
      kind: "number",
      label: "CPR %",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Unmet need as a percent of the base.",
      id: "unmetNeedPercent",
      kind: "number",
      label: "Unmet need %",
    },
    {
      description: "Contraceptive prevalence plus unmet need percent.",
      id: "totalDemandPercent",
      kind: "number",
      label: "Total demand %",
    },
    {
      description: "Share of total demand met by current use, in percent.",
      id: "demandSatisfiedPercent",
      kind: "number",
      label: "Demand satisfied %",
    },
  ],
  calculate: (input) =>
    calculateUnmetNeedContraceptionPercent(
      input as unknown as UnmetNeedContraceptionPercentInput,
    ),
});

export const runUnmetNeedContraceptionPercent =
  unmetNeedContraceptionPercentTool.execute;
export default unmetNeedContraceptionPercentTool;
