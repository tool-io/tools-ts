import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sumMoney,
  weightedMinor,
  strictlyIncreasing,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly grossBoxOfficeMinor: number;
  readonly callerTierCumulativeCapsMinor: readonly number[];
  readonly callerMarginalRoyaltyBasisPoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly grossInRoyaltyTiersMinor: readonly number[];
  readonly roundedRoyaltyByTierMinor: readonly number[];
  readonly totalCallerTieredRoyaltyMinor: number;
}>;
const inputFields = [
  {
    id: "grossBoxOfficeMinor",
    label: "Gross box office minor",
    kind: "number",
  },
  {
    id: "callerTierCumulativeCapsMinor",
    label: "Caller tier cumulative caps minor",
    kind: "numberList",
  },
  {
    id: "callerMarginalRoyaltyBasisPoints",
    label: "Caller marginal royalty basis points",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.grossBoxOfficeMinor, "gross", 0, 1000000000);
  strictlyIncreasing(input.callerTierCumulativeCapsMinor, "caps", 1);
  input.callerTierCumulativeCapsMinor.forEach((v) =>
    bounded(v, "cap", 1, 1000000000),
  );
  if (
    input.callerMarginalRoyaltyBasisPoints.length !==
    input.callerTierCumulativeCapsMinor.length + 1
  )
    simpleError("tiers", "One rate beyond final cumulative cap required.");
  input.callerMarginalRoyaltyBasisPoints.forEach((v) =>
    bounded(v, "rate", 0, 10000),
  );
  const ends = [
      ...input.callerTierCumulativeCapsMinor,
      input.grossBoxOfficeMinor,
    ],
    amounts = ends.map((end, i) =>
      Math.max(
        0,
        Math.min(input.grossBoxOfficeMinor, end) -
          (i ? input.callerTierCumulativeCapsMinor[i - 1] : 0),
      ),
    ),
    royalties = amounts.map((v, i) =>
      weightedMinor(v, input.callerMarginalRoyaltyBasisPoints[i], 10000),
    );
  return {
    grossInRoyaltyTiersMinor: amounts,
    roundedRoyaltyByTierMinor: royalties,
    totalCallerTieredRoyaltyMinor: sumMoney(royalties),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  grossBoxOfficeMinor: 3000,
  callerTierCumulativeCapsMinor: [1000, 2500],
  callerMarginalRoyaltyBasisPoints: [1000, 2000, 3000],
} satisfies Input;
export const exampleOutput = {
  grossInRoyaltyTiersMinor: [1000, 1500, 500],
  roundedRoyaltyByTierMinor: [100, 300, 150],
  totalCallerTieredRoyaltyMinor: 550,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/royalty-percent-gross-box-office-tiered-calculator",
  title: "Royalty Percent Gross Box Office Tiered Calculator",
  description:
    "Apply explicit caller marginal box-office royalty tiers, rounding each tier in a single currency; not applying highest tier to all gross, contract interpretation, rights clearance or universal royalty rates.",
  inputs: inputFields,
  outputs: [
    {
      id: "grossInRoyaltyTiersMinor",
      label: "Gross in royalty tiers minor",
      kind: "numberList",
    },
    {
      id: "roundedRoyaltyByTierMinor",
      label: "Rounded royalty by tier minor",
      kind: "numberList",
    },
    {
      id: "totalCallerTieredRoyaltyMinor",
      label: "Total caller tiered royalty minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      grossBoxOfficeMinor: value.grossBoxOfficeMinor as number,
      callerTierCumulativeCapsMinor:
        value.callerTierCumulativeCapsMinor as readonly number[],
      callerMarginalRoyaltyBasisPoints:
        value.callerMarginalRoyaltyBasisPoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
