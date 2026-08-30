import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly expectedCurrentYearNeedleCounts: readonly number[];
  readonly retainedCurrentYearNeedleCounts: readonly number[];
  readonly unassessableExpectedCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly observableCurrentYearRetentionPercent: number;
  readonly wholeExpectedRetentionPercentBounds: readonly number[];
}>;
const inputFields = [
  {
    id: "expectedCurrentYearNeedleCounts",
    label: "Expected current year needle counts",
    kind: "numberList",
  },
  {
    id: "retainedCurrentYearNeedleCounts",
    label: "Retained current year needle counts",
    kind: "numberList",
  },
  {
    id: "unassessableExpectedCounts",
    label: "Unassessable expected counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.expectedCurrentYearNeedleCounts.forEach((v) =>
    count(v, "expectedCurrentYearNeedleCounts"),
  );
  input.retainedCurrentYearNeedleCounts.forEach((v) =>
    count(v, "retainedCurrentYearNeedleCounts"),
  );
  input.unassessableExpectedCounts.forEach((v) =>
    count(v, "unassessableExpectedCounts"),
  );
  aligned(
    input.expectedCurrentYearNeedleCounts,
    input.retainedCurrentYearNeedleCounts,
    "expectedCurrentYearNeedleCounts",
  );
  aligned(
    input.expectedCurrentYearNeedleCounts,
    input.unassessableExpectedCounts,
    "expectedCurrentYearNeedleCounts",
  );
  input.expectedCurrentYearNeedleCounts.forEach((v, i) => {
    if (
      input.retainedCurrentYearNeedleCounts[i] +
        input.unassessableExpectedCounts[i] >
      v
    )
      simpleError(
        "counts",
        "Retained observed and unassessable opportunities cannot exceed expected inventory.",
      );
  });
  const total = positive(
      input.expectedCurrentYearNeedleCounts.reduce((a, b) => a + b, 0),
      "expected",
    ),
    retained = input.retainedCurrentYearNeedleCounts.reduce((a, b) => a + b, 0),
    missing = input.unassessableExpectedCounts.reduce((a, b) => a + b, 0);
  return {
    observableCurrentYearRetentionPercent:
      (100 * retained) / positive(total - missing, "observable"),
    wholeExpectedRetentionPercentBounds: [
      (100 * retained) / total,
      (100 * (retained + missing)) / total,
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  expectedCurrentYearNeedleCounts: [100, 200],
  retainedCurrentYearNeedleCounts: [80, 100],
  unassessableExpectedCounts: [20, 0],
} satisfies Input;
export const exampleOutput = {
  observableCurrentYearRetentionPercent: 64.28571428571429,
  wholeExpectedRetentionPercentBounds: [60, 66.66666666666667],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/foliage-retention-current-year-needles-percent",
  title: "Current-Year Foliage Retention Percent",
  description:
    "Audit independently established current-year needle inventory with observability bounds; older needle cohorts are not pooled and retention alone does not identify stress/disease.",
  inputs: inputFields,
  outputs: [
    {
      id: "observableCurrentYearRetentionPercent",
      label: "Observable current year retention percent",
      kind: "number",
    },
    {
      id: "wholeExpectedRetentionPercentBounds",
      label: "Whole expected retention percent bounds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      expectedCurrentYearNeedleCounts:
        value.expectedCurrentYearNeedleCounts as readonly number[],
      retainedCurrentYearNeedleCounts:
        value.retainedCurrentYearNeedleCounts as readonly number[],
      unassessableExpectedCounts:
        value.unassessableExpectedCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
