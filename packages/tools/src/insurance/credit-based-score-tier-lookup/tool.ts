import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  weightedMinor,
  money,
  rating,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedCreditBasedInsuranceScore: number;
  readonly callerCreditScoreLowerEdges: readonly number[];
  readonly callerVerifiedScoreSurchargeBasisPoints: readonly number[];
  readonly callerPreScoreAnnualPremiumMinor: number;
}>;
export type Output = Readonly<{
  readonly callerAppliedCreditScoreSurchargeBasisPoints: number;
  readonly callerRoundedPremiumAdjustmentMinor: number;
}>;
const inputFields = [
  {
    id: "observedCreditBasedInsuranceScore",
    label: "Observed credit based insurance score",
    kind: "number",
  },
  {
    id: "callerCreditScoreLowerEdges",
    label: "Caller credit score lower edges",
    kind: "numberList",
  },
  {
    id: "callerVerifiedScoreSurchargeBasisPoints",
    label: "Caller verified score surcharge basis points",
    kind: "numberList",
  },
  {
    id: "callerPreScoreAnnualPremiumMinor",
    label: "Caller pre score annual premium minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedCreditBasedInsuranceScore, "observed exposure");
  money(input.callerPreScoreAnnualPremiumMinor);
  input.callerVerifiedScoreSurchargeBasisPoints.forEach((v) =>
    bounded(v, "basisPoints", 0, 10000),
  );
  const rate = rating(
    input.observedCreditBasedInsuranceScore,
    input.callerCreditScoreLowerEdges,
    input.callerVerifiedScoreSurchargeBasisPoints,
  );
  return {
    callerAppliedCreditScoreSurchargeBasisPoints: rate,
    callerRoundedPremiumAdjustmentMinor: weightedMinor(
      input.callerPreScoreAnnualPremiumMinor,
      rate,
      10000,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCreditBasedInsuranceScore: 15,
  callerCreditScoreLowerEdges: [0, 10, 20],
  callerVerifiedScoreSurchargeBasisPoints: [0, 1000, 2000],
  callerPreScoreAnnualPremiumMinor: 10000,
} satisfies Input;
export const exampleOutput = {
  callerAppliedCreditScoreSurchargeBasisPoints: 1000,
  callerRoundedPremiumAdjustmentMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/credit-based-score-tier-lookup",
  title: "Credit Based Insurance Score Tier Lookup",
  description:
    "Audit actual caller insurance score through independently verified permitted score tiers and premium surcharge, not consumer credit score conversion, protected-class inference or lawful rating determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAppliedCreditScoreSurchargeBasisPoints",
      label: "Caller applied credit score surcharge basis points",
      kind: "number",
    },
    {
      id: "callerRoundedPremiumAdjustmentMinor",
      label: "Caller rounded premium adjustment minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCreditBasedInsuranceScore:
        value.observedCreditBasedInsuranceScore as number,
      callerCreditScoreLowerEdges:
        value.callerCreditScoreLowerEdges as readonly number[],
      callerVerifiedScoreSurchargeBasisPoints:
        value.callerVerifiedScoreSurchargeBasisPoints as readonly number[],
      callerPreScoreAnnualPremiumMinor:
        value.callerPreScoreAnnualPremiumMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
