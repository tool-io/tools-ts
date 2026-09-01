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
  readonly observedDriverAgeYears: number;
  readonly callerAgeTierLowerEdgesYears: readonly number[];
  readonly callerAgeSurchargeBasisPoints: readonly number[];
  readonly callerAnnualBasePremiumMinor: number;
}>;
export type Output = Readonly<{
  readonly callerAgeSurchargeBasisPointsApplied: number;
  readonly callerRoundedPremiumAdjustmentMinor: number;
}>;
const inputFields = [
  {
    id: "observedDriverAgeYears",
    label: "Observed driver age years",
    kind: "number",
  },
  {
    id: "callerAgeTierLowerEdgesYears",
    label: "Caller age tier lower edges years",
    kind: "numberList",
  },
  {
    id: "callerAgeSurchargeBasisPoints",
    label: "Caller age surcharge basis points",
    kind: "numberList",
  },
  {
    id: "callerAnnualBasePremiumMinor",
    label: "Caller annual base premium minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedDriverAgeYears, "observed exposure");
  money(input.callerAnnualBasePremiumMinor);
  input.callerAgeSurchargeBasisPoints.forEach((v) =>
    bounded(v, "basisPoints", 0, 10000),
  );
  const rate = rating(
    input.observedDriverAgeYears,
    input.callerAgeTierLowerEdgesYears,
    input.callerAgeSurchargeBasisPoints,
  );
  return {
    callerAgeSurchargeBasisPointsApplied: rate,
    callerRoundedPremiumAdjustmentMinor: weightedMinor(
      input.callerAnnualBasePremiumMinor,
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
  observedDriverAgeYears: 15,
  callerAgeTierLowerEdgesYears: [0, 10, 20],
  callerAgeSurchargeBasisPoints: [0, 1000, 2000],
  callerAnnualBasePremiumMinor: 10000,
} satisfies Input;
export const exampleOutput = {
  callerAgeSurchargeBasisPointsApplied: 1000,
  callerRoundedPremiumAdjustmentMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/driver-age-surcharge-tier-lookup",
  title: "Driver Age Surcharge Tier Lookup",
  description:
    "Read actual driver-age surcharge from explicit caller lower-inclusive age tiers and base premium; no default age-risk stereotypes, lawful rating authority or insurer rate inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAgeSurchargeBasisPointsApplied",
      label: "Caller age surcharge basis points applied",
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
      observedDriverAgeYears: value.observedDriverAgeYears as number,
      callerAgeTierLowerEdgesYears:
        value.callerAgeTierLowerEdgesYears as readonly number[],
      callerAgeSurchargeBasisPoints:
        value.callerAgeSurchargeBasisPoints as readonly number[],
      callerAnnualBasePremiumMinor:
        value.callerAnnualBasePremiumMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
