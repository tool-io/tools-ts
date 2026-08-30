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
  count,
  aligned,
  totalCount,
} from "../shared.js";
export type Input = Readonly<{
  readonly documentationTargetItemCounts: readonly number[];
  readonly documentedItemCounts: readonly number[];
  readonly unassessedTargetItemCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly confirmedTargetCoveragePercent: number;
  readonly possibleTargetCoverageUpperPercent: number;
  readonly unassessedTargetCount: number;
}>;
const inputFields = [
  {
    id: "documentationTargetItemCounts",
    label: "Documentation target item counts",
    kind: "numberList",
  },
  {
    id: "documentedItemCounts",
    label: "Documented item counts",
    kind: "numberList",
  },
  {
    id: "unassessedTargetItemCounts",
    label: "Unassessed target item counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.documentationTargetItemCounts.forEach((v) =>
    count(v, "documentationTargetItemCounts"),
  );
  input.documentedItemCounts.forEach((v) => count(v, "documentedItemCounts"));
  input.unassessedTargetItemCounts.forEach((v) =>
    count(v, "unassessedTargetItemCounts"),
  );
  aligned(
    input.documentationTargetItemCounts,
    input.documentedItemCounts,
    "documentationTargetItemCounts",
  );
  aligned(
    input.documentationTargetItemCounts,
    input.unassessedTargetItemCounts,
    "documentationTargetItemCounts",
  );
  if (
    input.documentedItemCounts.some(
      (v, i) =>
        v + input.unassessedTargetItemCounts[i] >
        input.documentationTargetItemCounts[i],
    )
  )
    simpleError(
      "coverage",
      "Documented/unassessed disjoint subsets of explicit target required.",
    );
  const total = positive(
      totalCount(input.documentationTargetItemCounts, "targets"),
      "targets",
    ),
    d = totalCount(input.documentedItemCounts, "documented"),
    u = totalCount(input.unassessedTargetItemCounts, "unassessed");
  return {
    confirmedTargetCoveragePercent: (100 * d) / total,
    possibleTargetCoverageUpperPercent: (100 * (d + u)) / total,
    unassessedTargetCount: u,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  documentationTargetItemCounts: [10, 20],
  documentedItemCounts: [5, 15],
  unassessedTargetItemCounts: [2, 0],
} satisfies Input;
export const exampleOutput = {
  confirmedTargetCoveragePercent: 66.66666666666667,
  possibleTargetCoverageUpperPercent: 73.33333333333333,
  unassessedTargetCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/documentation-coverage-percent-checker",
  title: "Documentation Planning Coverage Percent Checker",
  description:
    "Audit documentation-plan target coverage and unresolved upper bound, not caller field completeness within already catalogued records or missing-as-documented assumptions.",
  inputs: inputFields,
  outputs: [
    {
      id: "confirmedTargetCoveragePercent",
      label: "Confirmed target coverage percent",
      kind: "number",
    },
    {
      id: "possibleTargetCoverageUpperPercent",
      label: "Possible target coverage upper percent",
      kind: "number",
    },
    {
      id: "unassessedTargetCount",
      label: "Unassessed target count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      documentationTargetItemCounts:
        value.documentationTargetItemCounts as readonly number[],
      documentedItemCounts: value.documentedItemCounts as readonly number[],
      unassessedTargetItemCounts:
        value.unassessedTargetItemCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
