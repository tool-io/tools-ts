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
  ordered,
  crossing,
} from "../shared.js";
export type Input = Readonly<{
  readonly controlTimesDays: readonly number[];
  readonly controlCumulativeHatchedCounts: readonly number[];
  readonly controlTotalEggCount: number;
  readonly exposedTimesDays: readonly number[];
  readonly exposedCumulativeHatchedCounts: readonly number[];
  readonly exposedTotalEggCount: number;
  readonly hatchCriterionFraction: number;
}>;
export type Output = Readonly<{
  readonly controlCriterionDay: number;
  readonly exposedCriterionDay: number;
  readonly observedIncubationDelayDays: number;
}>;
const inputFields = [
  { id: "controlTimesDays", label: "Control times days", kind: "numberList" },
  {
    id: "controlCumulativeHatchedCounts",
    label: "Control cumulative hatched counts",
    kind: "numberList",
  },
  {
    id: "controlTotalEggCount",
    label: "Control total egg count",
    kind: "integer",
  },
  { id: "exposedTimesDays", label: "Exposed times days", kind: "numberList" },
  {
    id: "exposedCumulativeHatchedCounts",
    label: "Exposed cumulative hatched counts",
    kind: "numberList",
  },
  {
    id: "exposedTotalEggCount",
    label: "Exposed total egg count",
    kind: "integer",
  },
  {
    id: "hatchCriterionFraction",
    label: "Hatch criterion fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.controlTotalEggCount, "controlTotalEggCount");
  positive(input.exposedTotalEggCount, "exposedTotalEggCount");
  positive(input.hatchCriterionFraction, "hatchCriterionFraction");
  fraction(input.hatchCriterionFraction, "hatchCriterionFraction");
  count(input.controlTotalEggCount, "controlTotalEggCount");
  count(input.exposedTotalEggCount, "exposedTotalEggCount");
  input.controlCumulativeHatchedCounts.forEach((v) =>
    count(v, "controlCumulativeHatchedCounts"),
  );
  input.exposedCumulativeHatchedCounts.forEach((v) =>
    count(v, "exposedCumulativeHatchedCounts"),
  );
  for (const [times, counts, total] of [
    [
      input.controlTimesDays,
      input.controlCumulativeHatchedCounts,
      input.controlTotalEggCount,
    ],
    [
      input.exposedTimesDays,
      input.exposedCumulativeHatchedCounts,
      input.exposedTotalEggCount,
    ],
  ] as const) {
    ordered(times, "timesDays");
    aligned(times, counts, "counts");
    if (counts.some((v, i) => v > total || (i > 0 && v < counts[i - 1])))
      simpleError(
        "counts",
        "Monotone cumulative hatch counts within the original egg denominator required.",
      );
  }
  const controlCriterionDay = crossing(
      input.controlTimesDays,
      input.controlCumulativeHatchedCounts,
      input.controlTotalEggCount * input.hatchCriterionFraction,
    ),
    exposedCriterionDay = crossing(
      input.exposedTimesDays,
      input.exposedCumulativeHatchedCounts,
      input.exposedTotalEggCount * input.hatchCriterionFraction,
    );
  return {
    controlCriterionDay,
    exposedCriterionDay,
    observedIncubationDelayDays: exposedCriterionDay - controlCriterionDay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  controlTimesDays: [0, 2, 4],
  controlCumulativeHatchedCounts: [0, 50, 100],
  controlTotalEggCount: 100,
  exposedTimesDays: [0, 3, 6],
  exposedCumulativeHatchedCounts: [0, 50, 100],
  exposedTotalEggCount: 100,
  hatchCriterionFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  controlCriterionDay: 2,
  exposedCriterionDay: 3,
  observedIncubationDelayDays: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/nonhibernating-acid-incubation-delay-days",
  title: "Nonhibernating Acid Incubation Delay Days",
  description:
    "Compare observed exposed/control hatch-fraction timings on original egg denominators; signed delay is descriptive, censored/plateau crossings error, and no acid recipe or causal inference is supplied.",
  inputs: inputFields,
  outputs: [
    {
      id: "controlCriterionDay",
      label: "Control criterion day",
      kind: "number",
    },
    {
      id: "exposedCriterionDay",
      label: "Exposed criterion day",
      kind: "number",
    },
    {
      id: "observedIncubationDelayDays",
      label: "Observed incubation delay days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      controlTimesDays: value.controlTimesDays as readonly number[],
      controlCumulativeHatchedCounts:
        value.controlCumulativeHatchedCounts as readonly number[],
      controlTotalEggCount: value.controlTotalEggCount as number,
      exposedTimesDays: value.exposedTimesDays as readonly number[],
      exposedCumulativeHatchedCounts:
        value.exposedCumulativeHatchedCounts as readonly number[],
      exposedTotalEggCount: value.exposedTotalEggCount as number,
      hatchCriterionFraction: value.hatchCriterionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
