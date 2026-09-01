import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  weightedMinor,
  money,
  rating,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRatedAtFaultAccidentCount: number;
  readonly callerAtFaultCountLowerEdges: readonly number[];
  readonly callerAtFaultSurchargeBasisPoints: readonly number[];
  readonly callerPreAccidentAnnualPremiumMinor: number;
}>;
export type Output = Readonly<{
  readonly callerAtFaultSurchargeBasisPointsApplied: number;
  readonly callerRoundedPremiumAdjustmentMinor: number;
}>;
const inputFields = [
  {
    id: "observedRatedAtFaultAccidentCount",
    label: "Observed rated at fault accident count",
    kind: "number",
  },
  {
    id: "callerAtFaultCountLowerEdges",
    label: "Caller at fault count lower edges",
    kind: "numberList",
  },
  {
    id: "callerAtFaultSurchargeBasisPoints",
    label: "Caller at fault surcharge basis points",
    kind: "numberList",
  },
  {
    id: "callerPreAccidentAnnualPremiumMinor",
    label: "Caller pre accident annual premium minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(
    input.observedRatedAtFaultAccidentCount,
    "observed exposure",
    0,
    1000000,
  );
  money(input.callerPreAccidentAnnualPremiumMinor);
  input.callerAtFaultSurchargeBasisPoints.forEach((v) =>
    bounded(v, "basisPoints", 0, 10000),
  );
  const rate = rating(
    input.observedRatedAtFaultAccidentCount,
    input.callerAtFaultCountLowerEdges,
    input.callerAtFaultSurchargeBasisPoints,
  );
  return {
    callerAtFaultSurchargeBasisPointsApplied: rate,
    callerRoundedPremiumAdjustmentMinor: weightedMinor(
      input.callerPreAccidentAnnualPremiumMinor,
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
  observedRatedAtFaultAccidentCount: 15,
  callerAtFaultCountLowerEdges: [0, 10, 20],
  callerAtFaultSurchargeBasisPoints: [0, 1000, 2000],
  callerPreAccidentAnnualPremiumMinor: 10000,
} satisfies Input;
export const exampleOutput = {
  callerAtFaultSurchargeBasisPointsApplied: 1000,
  callerRoundedPremiumAdjustmentMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/at-fault-surcharge-percent-table",
  title: "At Fault Surcharge Percent Table Lookup",
  description:
    "Audit actual rated at-fault accident count under caller verified surcharge tiers and pre-accident premium; input is rating evidence, no finding of liability or jurisdiction rate authority.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAtFaultSurchargeBasisPointsApplied",
      label: "Caller at fault surcharge basis points applied",
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
      observedRatedAtFaultAccidentCount:
        value.observedRatedAtFaultAccidentCount as number,
      callerAtFaultCountLowerEdges:
        value.callerAtFaultCountLowerEdges as readonly number[],
      callerAtFaultSurchargeBasisPoints:
        value.callerAtFaultSurchargeBasisPoints as readonly number[],
      callerPreAccidentAnnualPremiumMinor:
        value.callerPreAccidentAnnualPremiumMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
