import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
  shape,
  totalCount,
} from "../shared.js";
export type Input = Readonly<{
  readonly orderedYearBuckets: readonly (readonly number[])[];
  readonly datedItemCountsByBucket: readonly number[];
  readonly callerBulkCoverageFraction: number;
}>;
export type Output = Readonly<{
  readonly shortestContiguousBulkYearBounds: readonly number[];
  readonly achievedDatedItemCoverageFraction: number;
}>;
const inputFields = [
  { id: "orderedYearBuckets", label: "Ordered year buckets", kind: "matrix" },
  {
    id: "datedItemCountsByBucket",
    label: "Dated item counts by bucket",
    kind: "numberList",
  },
  {
    id: "callerBulkCoverageFraction",
    label: "Caller bulk coverage fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerBulkCoverageFraction, "callerBulkCoverageFraction");
  fraction(input.callerBulkCoverageFraction, "callerBulkCoverageFraction");
  input.datedItemCountsByBucket.forEach((v) =>
    count(v, "datedItemCountsByBucket"),
  );
  aligned(
    input.orderedYearBuckets,
    input.datedItemCountsByBucket,
    "orderedYearBuckets",
  );
  if (
    shape(input.orderedYearBuckets, "buckets") !== 2 ||
    input.orderedYearBuckets.some(
      (r, i) =>
        r[1] <= r[0] || (i > 0 && r[0] < input.orderedYearBuckets[i - 1][1]),
    )
  )
    simpleError(
      "buckets",
      "Ordered nonoverlapping positive-width year buckets required.",
    );
  const total = positive(
      totalCount(input.datedItemCountsByBucket, "datedItems"),
      "datedItems",
    ),
    target = total * input.callerBulkCoverageFraction;
  let best = Infinity,
    lo = 0,
    hi = 0,
    covered = 0;
  for (let i = 0; i < input.orderedYearBuckets.length; i++) {
    let n = 0;
    for (let j = i; j < input.orderedYearBuckets.length; j++) {
      n += input.datedItemCountsByBucket[j];
      if (n >= target) {
        const width =
          input.orderedYearBuckets[j][1] - input.orderedYearBuckets[i][0];
        if (width < best) {
          best = width;
          lo = i;
          hi = j;
          covered = n;
        }
        break;
      }
    }
  }
  return {
    shortestContiguousBulkYearBounds: [
      input.orderedYearBuckets[lo][0],
      input.orderedYearBuckets[hi][1],
    ],
    achievedDatedItemCoverageFraction: covered / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  orderedYearBuckets: [
    [1900, 1910],
    [1910, 1920],
    [1920, 1930],
  ],
  datedItemCountsByBucket: [1, 8, 1],
  callerBulkCoverageFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  shortestContiguousBulkYearBounds: [1910, 1920],
  achievedDatedItemCoverageFraction: 0.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/bulk-date-dominant-extractor",
  title: "Bulk Date Dominant Range Extractor",
  description:
    "Find earliest tied shortest contiguous bucket span meeting caller dated-item coverage, with at most 128² comparisons; undated records and within-bucket temporal precision are not invented.",
  inputs: inputFields,
  outputs: [
    {
      id: "shortestContiguousBulkYearBounds",
      label: "Shortest contiguous bulk year bounds",
      kind: "numberList",
    },
    {
      id: "achievedDatedItemCoverageFraction",
      label: "Achieved dated item coverage fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      orderedYearBuckets:
        value.orderedYearBuckets as readonly (readonly number[])[],
      datedItemCountsByBucket:
        value.datedItemCountsByBucket as readonly number[],
      callerBulkCoverageFraction: value.callerBulkCoverageFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
