import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly observedRingWidthsMm: readonly number[];
  readonly missingRingCountsBeforeEach: readonly number[];
  readonly estimatedMissingOuterRings: number;
  readonly lastObservedRingCalendarYear: number;
}>;
export type Output = Readonly<{
  readonly observedRingCount: number;
  readonly inferredRepresentedYears: number;
  readonly firstRepresentedCalendarYear: number;
  readonly outermostYearScenario: number;
}>;
const inputFields = [
  {
    id: "observedRingWidthsMm",
    label: "Observed ring widths mm",
    kind: "numberList",
  },
  {
    id: "missingRingCountsBeforeEach",
    label: "Missing ring counts before each",
    kind: "numberList",
  },
  {
    id: "estimatedMissingOuterRings",
    label: "Estimated missing outer rings",
    kind: "integer",
  },
  {
    id: "lastObservedRingCalendarYear",
    label: "Last observed ring calendar year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRingWidthsMm.forEach((v) =>
    positive(v, "observedRingWidthsMm"),
  );
  input.missingRingCountsBeforeEach.forEach((v) =>
    count(v, "missingRingCountsBeforeEach"),
  );
  count(input.estimatedMissingOuterRings, "estimatedMissingOuterRings");
  aligned(
    input.observedRingWidthsMm,
    input.missingRingCountsBeforeEach,
    "observedRingWidthsMm",
  );
  const missing = input.missingRingCountsBeforeEach.reduce((a, b) => a + b, 0),
    representedObservedSpan = input.observedRingWidthsMm.length + missing;
  return {
    observedRingCount: input.observedRingWidthsMm.length,
    inferredRepresentedYears:
      representedObservedSpan + input.estimatedMissingOuterRings,
    firstRepresentedCalendarYear:
      input.lastObservedRingCalendarYear - representedObservedSpan + 1,
    outermostYearScenario:
      input.lastObservedRingCalendarYear + input.estimatedMissingOuterRings,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRingWidthsMm: [1, 2, 1],
  missingRingCountsBeforeEach: [0, 1, 0],
  estimatedMissingOuterRings: 2,
  lastObservedRingCalendarYear: 2000,
} satisfies Input;
export const exampleOutput = {
  observedRingCount: 3,
  inferredRepresentedYears: 6,
  firstRepresentedCalendarYear: 1997,
  outermostYearScenario: 2002,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/dendro-ring-count",
  title: "Dendro Ring Count Tool",
  description:
    "Count measured dendro rings with explicit inferred missing-ring and outer-loss assumptions; calendar anchors are supplied, not independently dated by counting.",
  inputs: inputFields,
  outputs: [
    { id: "observedRingCount", label: "Observed ring count", kind: "number" },
    {
      id: "inferredRepresentedYears",
      label: "Inferred represented years",
      kind: "number",
    },
    {
      id: "firstRepresentedCalendarYear",
      label: "First represented calendar year",
      kind: "number",
    },
    {
      id: "outermostYearScenario",
      label: "Outermost year scenario",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRingWidthsMm: value.observedRingWidthsMm as readonly number[],
      missingRingCountsBeforeEach:
        value.missingRingCountsBeforeEach as readonly number[],
      estimatedMissingOuterRings: value.estimatedMissingOuterRings as number,
      lastObservedRingCalendarYear:
        value.lastObservedRingCalendarYear as number,
    }),
});
export const run = tool.execute;
export default tool;
