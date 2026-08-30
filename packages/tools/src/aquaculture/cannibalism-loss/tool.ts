import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly initialFishCount: number;
  readonly remainingFishCount: number;
  readonly verifiedOtherLossCount: number;
  readonly confirmedCannibalismCount: number;
}>;
export type Output = Readonly<{
  readonly unexplainedMissingCount: number;
  readonly minimumCannibalismLossPercent: number;
  readonly maximumPossibleCannibalismLossPercent: number;
}>;
const inputFields = [
  { id: "initialFishCount", label: "Initial fish count", kind: "integer" },
  { id: "remainingFishCount", label: "Remaining fish count", kind: "integer" },
  {
    id: "verifiedOtherLossCount",
    label: "Verified other loss count",
    kind: "integer",
  },
  {
    id: "confirmedCannibalismCount",
    label: "Confirmed cannibalism count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialFishCount, "initialFishCount");
  count(input.initialFishCount, "initialFishCount");
  count(input.remainingFishCount, "remainingFishCount");
  count(input.verifiedOtherLossCount, "verifiedOtherLossCount");
  count(input.confirmedCannibalismCount, "confirmedCannibalismCount");
  const unexplainedMissingCount =
    input.initialFishCount -
    input.remainingFishCount -
    input.verifiedOtherLossCount -
    input.confirmedCannibalismCount;
  if (unexplainedMissingCount < 0)
    simpleError(
      "remainingFishCount",
      "Loss categories exceed matched initial inventory.",
    );
  return {
    unexplainedMissingCount,
    minimumCannibalismLossPercent:
      (100 * input.confirmedCannibalismCount) / input.initialFishCount,
    maximumPossibleCannibalismLossPercent:
      (100 * (input.confirmedCannibalismCount + unexplainedMissingCount)) /
      input.initialFishCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialFishCount: 1000,
  remainingFishCount: 900,
  verifiedOtherLossCount: 60,
  confirmedCannibalismCount: 10,
} satisfies Input;
export const exampleOutput = {
  unexplainedMissingCount: 30,
  minimumCannibalismLossPercent: 1,
  maximumPossibleCannibalismLossPercent: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/cannibalism-loss",
  title: "Cannibalism Loss Estimate",
  description:
    "Bound possible cannibalism losses using confirmed cases and unexplained missing inventory after other verified losses; does not assign unexplained losses to cannibalism.",
  inputs: inputFields,
  outputs: [
    {
      id: "unexplainedMissingCount",
      label: "Unexplained missing count",
      kind: "number",
    },
    {
      id: "minimumCannibalismLossPercent",
      label: "Minimum cannibalism loss percent",
      kind: "number",
    },
    {
      id: "maximumPossibleCannibalismLossPercent",
      label: "Maximum possible cannibalism loss percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialFishCount: value.initialFishCount as number,
      remainingFishCount: value.remainingFishCount as number,
      verifiedOtherLossCount: value.verifiedOtherLossCount as number,
      confirmedCannibalismCount: value.confirmedCannibalismCount as number,
    }),
});
export const run = tool.execute;
export default tool;
