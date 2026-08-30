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
  variance,
  regression,
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly sampleRingWidthsMm: readonly number[];
  readonly masterRingWidthsMm: readonly number[];
  readonly masterFirstCalendarYear: number;
  readonly callerMinimumCorrelation: number;
}>;
export type Output = Readonly<{
  readonly candidateStartYears: readonly number[];
  readonly candidateCorrelations: readonly number[];
  readonly bestCandidateStartYear: number;
  readonly bestCorrelation: number;
  readonly aboveCallerMatchThreshold: boolean;
}>;
const inputFields = [
  {
    id: "sampleRingWidthsMm",
    label: "Sample ring widths mm",
    kind: "numberList",
  },
  {
    id: "masterRingWidthsMm",
    label: "Master ring widths mm",
    kind: "numberList",
  },
  {
    id: "masterFirstCalendarYear",
    label: "Master first calendar year",
    kind: "number",
  },
  {
    id: "callerMinimumCorrelation",
    label: "Caller minimum correlation",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampleRingWidthsMm.forEach((v) => positive(v, "sampleRingWidthsMm"));
  input.masterRingWidthsMm.forEach((v) => positive(v, "masterRingWidthsMm"));
  if (
    input.sampleRingWidthsMm.length < 3 ||
    input.sampleRingWidthsMm.length > input.masterRingWidthsMm.length ||
    input.masterRingWidthsMm.length * input.sampleRingWidthsMm.length >
      1000000 ||
    input.callerMinimumCorrelation < -1 ||
    input.callerMinimumCorrelation > 1
  )
    simpleError(
      "rings",
      "At least three sample rings, feasible master window, bounded work and correlation threshold in [-1,1] required.",
    );
  const sd = Math.sqrt(
      positive(variance(input.sampleRingWidthsMm), "sampleRingWidthsMm"),
    ),
    candidateStartYears: number[] = [],
    candidateCorrelations: number[] = [];
  for (
    let i = 0;
    i <= input.masterRingWidthsMm.length - input.sampleRingWidthsMm.length;
    i++
  ) {
    const segment = input.masterRingWidthsMm.slice(
        i,
        i + input.sampleRingWidthsMm.length,
      ),
      v = variance(segment);
    if (v === 0)
      simpleError(
        "masterRingWidthsMm",
        "Constant master window has undefined Pearson match.",
      );
    const fit = regression(input.sampleRingWidthsMm, segment);
    candidateStartYears.push(input.masterFirstCalendarYear + i);
    candidateCorrelations.push(
      Math.max(-1, Math.min(1, (fit.slope * sd) / Math.sqrt(v))),
    );
  }
  const best = candidateCorrelations.indexOf(maximum(candidateCorrelations));
  return {
    candidateStartYears,
    candidateCorrelations,
    bestCandidateStartYear: candidateStartYears[best],
    bestCorrelation: candidateCorrelations[best],
    aboveCallerMatchThreshold:
      candidateCorrelations[best] >= input.callerMinimumCorrelation,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleRingWidthsMm: [1, 2, 3],
  masterRingWidthsMm: [4, 1, 2, 3, 1],
  masterFirstCalendarYear: 1900,
  callerMinimumCorrelation: 0.99,
} satisfies Input;
export const exampleOutput = {
  candidateStartYears: [1900, 1901, 1902],
  candidateCorrelations: [-0.6546536707079771, 1, -0.5],
  bestCandidateStartYear: 1901,
  bestCorrelation: 1,
  aboveCallerMatchThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/dendro-master-curve-match",
  title: "Dendro Master Curve Match Checker",
  description:
    "Scan all whole-ring offsets using signed Pearson correlation on supplied sequences, first offset breaking ties; candidate correlations and a caller cutoff are not a statistically validated dendro date.",
  inputs: inputFields,
  outputs: [
    {
      id: "candidateStartYears",
      label: "Candidate start years",
      kind: "numberList",
    },
    {
      id: "candidateCorrelations",
      label: "Candidate correlations",
      kind: "numberList",
    },
    {
      id: "bestCandidateStartYear",
      label: "Best candidate start year",
      kind: "number",
    },
    { id: "bestCorrelation", label: "Best correlation", kind: "number" },
    {
      id: "aboveCallerMatchThreshold",
      label: "Above caller match threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleRingWidthsMm: value.sampleRingWidthsMm as readonly number[],
      masterRingWidthsMm: value.masterRingWidthsMm as readonly number[],
      masterFirstCalendarYear: value.masterFirstCalendarYear as number,
      callerMinimumCorrelation: value.callerMinimumCorrelation as number,
    }),
});
export const run = tool.execute;
export default tool;
