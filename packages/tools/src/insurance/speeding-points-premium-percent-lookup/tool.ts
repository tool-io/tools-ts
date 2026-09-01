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
  readonly observedRatedSpeedingPoints: number;
  readonly callerSpeedingPointLowerEdges: readonly number[];
  readonly callerSpeedingSurchargeBasisPoints: readonly number[];
  readonly callerPrePointAnnualPremiumMinor: number;
}>;
export type Output = Readonly<{
  readonly callerSpeedingSurchargeBasisPointsApplied: number;
  readonly callerRoundedPremiumAdjustmentMinor: number;
}>;
const inputFields = [
  {
    id: "observedRatedSpeedingPoints",
    label: "Observed rated speeding points",
    kind: "number",
  },
  {
    id: "callerSpeedingPointLowerEdges",
    label: "Caller speeding point lower edges",
    kind: "numberList",
  },
  {
    id: "callerSpeedingSurchargeBasisPoints",
    label: "Caller speeding surcharge basis points",
    kind: "numberList",
  },
  {
    id: "callerPrePointAnnualPremiumMinor",
    label: "Caller pre point annual premium minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedRatedSpeedingPoints, "observed exposure");
  money(input.callerPrePointAnnualPremiumMinor);
  input.callerSpeedingSurchargeBasisPoints.forEach((v) =>
    bounded(v, "basisPoints", 0, 10000),
  );
  const rate = rating(
    input.observedRatedSpeedingPoints,
    input.callerSpeedingPointLowerEdges,
    input.callerSpeedingSurchargeBasisPoints,
  );
  return {
    callerSpeedingSurchargeBasisPointsApplied: rate,
    callerRoundedPremiumAdjustmentMinor: weightedMinor(
      input.callerPrePointAnnualPremiumMinor,
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
  observedRatedSpeedingPoints: 15,
  callerSpeedingPointLowerEdges: [0, 10, 20],
  callerSpeedingSurchargeBasisPoints: [0, 1000, 2000],
  callerPrePointAnnualPremiumMinor: 10000,
} satisfies Input;
export const exampleOutput = {
  callerSpeedingSurchargeBasisPointsApplied: 1000,
  callerRoundedPremiumAdjustmentMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/speeding-points-premium-percent-lookup",
  title: "Speeding Points Premium Percent Lookup",
  description:
    "Read actual rated speeding-point surcharge against verified caller insurer point table, not police offense conversion or universal traffic/insurance policy.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerSpeedingSurchargeBasisPointsApplied",
      label: "Caller speeding surcharge basis points applied",
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
      observedRatedSpeedingPoints: value.observedRatedSpeedingPoints as number,
      callerSpeedingPointLowerEdges:
        value.callerSpeedingPointLowerEdges as readonly number[],
      callerSpeedingSurchargeBasisPoints:
        value.callerSpeedingSurchargeBasisPoints as readonly number[],
      callerPrePointAnnualPremiumMinor:
        value.callerPrePointAnnualPremiumMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
