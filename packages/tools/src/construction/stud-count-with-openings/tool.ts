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
  nonnegative,
  bounded,
  integer,
  aligned,
  sum,
  strictlyIncreasing,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly wallRunM: number;
  readonly callerMaximumStudSpacingM: number;
  readonly openingLeftEdgesM: readonly number[];
  readonly openingRightEdgesM: readonly number[];
  readonly callerAdditionalHeaderJackStudCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly retainedRegularStudCentersM: readonly number[];
  readonly openingBoundaryStudCentersM: readonly number[];
  readonly callerAdditionalJackStudCount: number;
  readonly totalCountedStudPositionsAndJacks: number;
}>;
const inputFields = [
  { id: "wallRunM", label: "Wall run m", kind: "number" },
  {
    id: "callerMaximumStudSpacingM",
    label: "Caller maximum stud spacing m",
    kind: "number",
  },
  {
    id: "openingLeftEdgesM",
    label: "Opening left edges m",
    kind: "numberList",
  },
  {
    id: "openingRightEdgesM",
    label: "Opening right edges m",
    kind: "numberList",
  },
  {
    id: "callerAdditionalHeaderJackStudCounts",
    label: "Caller additional header jack stud counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.wallRunM, "wallRunM");
  positive(input.callerMaximumStudSpacingM, "callerMaximumStudSpacingM");
  input.openingLeftEdgesM.forEach((v) => nonnegative(v, "openingLeftEdgesM"));
  input.openingRightEdgesM.forEach((v) => nonnegative(v, "openingRightEdgesM"));
  input.callerAdditionalHeaderJackStudCounts.forEach((v) =>
    nonnegative(v, "callerAdditionalHeaderJackStudCounts"),
  );
  aligned(
    input.openingLeftEdgesM,
    input.openingRightEdgesM,
    "openingLeftEdgesM",
  );
  aligned(
    input.openingLeftEdgesM,
    input.callerAdditionalHeaderJackStudCounts,
    "openingLeftEdgesM",
  );
  strictlyIncreasing(input.openingLeftEdgesM, "openings", 1);
  input.openingLeftEdgesM.forEach((v, i) => {
    if (
      v >= input.openingRightEdgesM[i] ||
      input.openingRightEdgesM[i] > input.wallRunM ||
      (i > 0 && v < input.openingRightEdgesM[i - 1])
    )
      simpleError(
        "openings",
        "Positive disjoint opening intervals inside wall.",
      );
  });
  input.callerAdditionalHeaderJackStudCounts.forEach((v) =>
    integer(v, "additional studs"),
  );
  const slots = Math.ceil(input.wallRunM / input.callerMaximumStudSpacingM);
  bounded(slots, "slots", 1, 10000);
  const grid = Array.from(
      { length: slots + 1 },
      (_, i) => (i * input.wallRunM) / slots,
    ).filter(
      (x) =>
        !input.openingLeftEdgesM.some(
          (l, j) => x > l && x < input.openingRightEdgesM[j],
        ),
    ),
    bounds = [
      ...new Set([...input.openingLeftEdgesM, ...input.openingRightEdgesM]),
    ]
      .filter((x) => !grid.includes(x))
      .sort((a, b) => a - b),
    extra = sum(input.callerAdditionalHeaderJackStudCounts);
  return {
    retainedRegularStudCentersM: grid,
    openingBoundaryStudCentersM: bounds,
    callerAdditionalJackStudCount: extra,
    totalCountedStudPositionsAndJacks: grid.length + bounds.length + extra,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wallRunM: 4,
  callerMaximumStudSpacingM: 1,
  openingLeftEdgesM: [1.5],
  openingRightEdgesM: [2.5],
  callerAdditionalHeaderJackStudCounts: [2],
} satisfies Input;
export const exampleOutput = {
  retainedRegularStudCentersM: [0, 1, 3, 4],
  openingBoundaryStudCentersM: [1.5, 2.5],
  callerAdditionalJackStudCount: 2,
  totalCountedStudPositionsAndJacks: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/stud-count-with-openings",
  title: "Stud Count With Openings Calculator",
  description:
    "Explicit equal-spacing wall-center layout removes centers strictly inside disjoint openings, deduplicates boundary studs and adds independent jack schedule; not structural framing compliance. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "retainedRegularStudCentersM",
      label: "Retained regular stud centers m",
      kind: "numberList",
    },
    {
      id: "openingBoundaryStudCentersM",
      label: "Opening boundary stud centers m",
      kind: "numberList",
    },
    {
      id: "callerAdditionalJackStudCount",
      label: "Caller additional jack stud count",
      kind: "number",
    },
    {
      id: "totalCountedStudPositionsAndJacks",
      label: "Total counted stud positions and jacks",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      wallRunM: value.wallRunM as number,
      callerMaximumStudSpacingM: value.callerMaximumStudSpacingM as number,
      openingLeftEdgesM: value.openingLeftEdgesM as readonly number[],
      openingRightEdgesM: value.openingRightEdgesM as readonly number[],
      callerAdditionalHeaderJackStudCounts:
        value.callerAdditionalHeaderJackStudCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
