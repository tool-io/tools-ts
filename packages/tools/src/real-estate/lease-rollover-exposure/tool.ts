import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
  aligned,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualLeaseRentWeights: readonly number[];
  readonly actualExpiryOffsetsDays: readonly number[];
  readonly callerReviewHorizonDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLeaseRentWeights",
    label: "Actual lease rent weights",
    kind: "numberList",
  },
  {
    id: "actualExpiryOffsetsDays",
    label: "Actual expiry offsets days",
    kind: "numberList",
  },
  {
    id: "callerReviewHorizonDays",
    label: "Caller review horizon days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualLeaseRentWeights.length)
    simpleError("actualLeaseRentWeights", "Actual nonempty observations.");
  input.actualLeaseRentWeights.forEach((v) =>
    nonnegative(v, "actualLeaseRentWeights"),
  );
  if (!input.actualExpiryOffsetsDays.length)
    simpleError("actualExpiryOffsetsDays", "Actual nonempty observations.");
  input.actualExpiryOffsetsDays.forEach((v) =>
    nonnegative(v, "actualExpiryOffsetsDays"),
  );
  nonnegative(input.callerReviewHorizonDays, "callerReviewHorizonDays");
  aligned(
    input.actualLeaseRentWeights,
    input.actualExpiryOffsetsDays,
    "leases",
  );
  positive(sum(input.actualLeaseRentWeights), "rent");
  return {
    value:
      (100 *
        sum(
          input.actualLeaseRentWeights.map((v, i) =>
            input.actualExpiryOffsetsDays[i] <= input.callerReviewHorizonDays
              ? v
              : 0,
          ),
        )) /
      sum(input.actualLeaseRentWeights),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualLeaseRentWeights: [1, 1],
    actualExpiryOffsetsDays: [10, 30],
    callerReviewHorizonDays: 20,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/lease-rollover-exposure",
  title: "Lease Rollover Exposure Calculator",
  description:
    "Actual rent-weightedleaseexpiryexposurewithin independent day offset horizon, zero-dayexpiry included, unweightedcountnot substituted. No rollover vacancy/renewal forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
