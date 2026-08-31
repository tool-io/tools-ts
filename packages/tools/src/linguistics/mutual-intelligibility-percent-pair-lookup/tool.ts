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
  totalCount,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly comprehendedWordCountsByDirection: readonly number[];
  readonly testedWordCountsByDirection: readonly number[];
}>;
export type Output = Readonly<{
  readonly directionalObservedComprehensionPercents: readonly number[];
  readonly pooledObservedComprehensionPercent: number;
  readonly signedFirstMinusSecondDirectionPoints: number;
  readonly bothDirectionsObserved: boolean;
}>;
const inputFields = [
  {
    id: "comprehendedWordCountsByDirection",
    label: "Comprehended word counts by direction",
    kind: "numberList",
  },
  {
    id: "testedWordCountsByDirection",
    label: "Tested word counts by direction",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.comprehendedWordCountsByDirection.forEach((v) =>
    count(v, "comprehendedWordCountsByDirection"),
  );
  input.testedWordCountsByDirection.forEach((v) =>
    count(v, "testedWordCountsByDirection"),
  );
  if (
    input.comprehendedWordCountsByDirection.length !== 2 ||
    input.testedWordCountsByDirection.length !== 2 ||
    input.comprehendedWordCountsByDirection.some(
      (v, i) => v > input.testedWordCountsByDirection[i],
    )
  )
    simpleError(
      "counts",
      "Two directional feasible observed comprehension/test counts required.",
    );
  const total = positive(
      totalCount(input.testedWordCountsByDirection, "tests"),
      "observedTests",
    ),
    p = input.comprehendedWordCountsByDirection.map((v, i) =>
      input.testedWordCountsByDirection[i]
        ? (100 * v) / input.testedWordCountsByDirection[i]
        : -1,
    ),
    both = input.testedWordCountsByDirection.every((v) => v > 0);
  return {
    directionalObservedComprehensionPercents: p,
    pooledObservedComprehensionPercent:
      (100 *
        totalCount(input.comprehendedWordCountsByDirection, "comprehended")) /
      total,
    signedFirstMinusSecondDirectionPoints: both ? p[0] - p[1] : -1,
    bothDirectionsObserved: both,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  comprehendedWordCountsByDirection: [8, 3],
  testedWordCountsByDirection: [10, 10],
} satisfies Input;
export const exampleOutput = {
  directionalObservedComprehensionPercents: [80, 30],
  pooledObservedComprehensionPercent: 55,
  signedFirstMinusSecondDirectionPoints: 50,
  bothDirectionsObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/mutual-intelligibility-percent-pair-lookup",
  title: "Mutual Intelligibility Percent Pair Lookup",
  description:
    "Audit actual two-direction word-comprehension test counts with asymmetric rates and observed-word pooling; absent direction stays −1 with explicit evidence flag, not assumed mutual intelligibility or a population-language percentage.",
  inputs: inputFields,
  outputs: [
    {
      id: "directionalObservedComprehensionPercents",
      label: "Directional observed comprehension percents",
      kind: "numberList",
    },
    {
      id: "pooledObservedComprehensionPercent",
      label: "Pooled observed comprehension percent",
      kind: "number",
    },
    {
      id: "signedFirstMinusSecondDirectionPoints",
      label: "Signed first minus second direction points",
      kind: "number",
    },
    {
      id: "bothDirectionsObserved",
      label: "Both directions observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      comprehendedWordCountsByDirection:
        value.comprehendedWordCountsByDirection as readonly number[],
      testedWordCountsByDirection:
        value.testedWordCountsByDirection as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
