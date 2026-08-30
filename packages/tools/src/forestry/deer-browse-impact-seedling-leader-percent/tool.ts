import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly observedBrowsedLeaderCount: number;
  readonly observedIntactLeaderCount: number;
  readonly unassessableLeaderCount: number;
}>;
export type Output = Readonly<{
  readonly observableBrowsedLeaderPercent: number;
  readonly wholeLeaderBrowsePercentBounds: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBrowsedLeaderCount",
    label: "Observed browsed leader count",
    kind: "integer",
  },
  {
    id: "observedIntactLeaderCount",
    label: "Observed intact leader count",
    kind: "integer",
  },
  {
    id: "unassessableLeaderCount",
    label: "Unassessable leader count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.observedBrowsedLeaderCount, "observedBrowsedLeaderCount");
  count(input.observedIntactLeaderCount, "observedIntactLeaderCount");
  count(input.unassessableLeaderCount, "unassessableLeaderCount");
  const n = positive(
      input.observedBrowsedLeaderCount + input.observedIntactLeaderCount,
      "observableLeaders",
    ),
    total = n + input.unassessableLeaderCount;
  return {
    observableBrowsedLeaderPercent:
      (100 * input.observedBrowsedLeaderCount) / n,
    wholeLeaderBrowsePercentBounds: [
      (100 * input.observedBrowsedLeaderCount) / total,
      (100 *
        (input.observedBrowsedLeaderCount + input.unassessableLeaderCount)) /
        total,
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBrowsedLeaderCount: 20,
  observedIntactLeaderCount: 60,
  unassessableLeaderCount: 20,
} satisfies Input;
export const exampleOutput = {
  observableBrowsedLeaderPercent: 25,
  wholeLeaderBrowsePercentBounds: [20, 40],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/deer-browse-impact-seedling-leader-percent",
  title: "Deer Browse Leader Impact Percent",
  description:
    "Summarize caller identified browsed leaders on observable opportunities with whole-inventory bounds for missing assessments; browse agents are not automatically attributed to deer.",
  inputs: inputFields,
  outputs: [
    {
      id: "observableBrowsedLeaderPercent",
      label: "Observable browsed leader percent",
      kind: "number",
    },
    {
      id: "wholeLeaderBrowsePercentBounds",
      label: "Whole leader browse percent bounds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBrowsedLeaderCount: value.observedBrowsedLeaderCount as number,
      observedIntactLeaderCount: value.observedIntactLeaderCount as number,
      unassessableLeaderCount: value.unassessableLeaderCount as number,
    }),
});
export const run = tool.execute;
export default tool;
