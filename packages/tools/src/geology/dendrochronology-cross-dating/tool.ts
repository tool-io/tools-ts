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
  bounded,
  sum,
  mean,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly sampleWidths: readonly number[];
  readonly masterWidths: readonly number[];
  readonly callerCandidateOffsets: readonly number[];
}>;
export type Output = Readonly<{
  readonly candidateCorrelations: readonly number[];
  readonly bestOffsets: readonly number[];
}>;
const inputFields = [
  { id: "sampleWidths", label: "Sample widths", kind: "numberList" },
  { id: "masterWidths", label: "Master widths", kind: "numberList" },
  {
    id: "callerCandidateOffsets",
    label: "Caller candidate offsets",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.sampleWidths.length < 3 ||
    input.sampleWidths.length > 128 ||
    input.masterWidths.length > 256 ||
    input.callerCandidateOffsets.length > 128
  )
    simpleError("series", "Bounded3–128 sample,≤256 master,≤128 offsets.");
  const mx = mean(input.sampleWidths),
    dx = input.sampleWidths.map((v) => v - mx),
    sx = positive(sum(dx.map((v) => v * v)), "sample variation"),
    scores = input.callerCandidateOffsets.map((o) => {
      bounded(
        o,
        "offset",
        0,
        input.masterWidths.length - input.sampleWidths.length,
      );
      const y = input.masterWidths.slice(o, o + input.sampleWidths.length),
        my = mean(y),
        dy = y.map((v) => v - my),
        sy = positive(sum(dy.map((v) => v * v)), "master window variation");
      return sum(dx.map((v, i) => v * dy[i])) / Math.sqrt(sx * sy);
    }),
    best = Math.max(...scores);
  return {
    candidateCorrelations: scores,
    bestOffsets: input.callerCandidateOffsets.filter(
      (_, i) => scores[i] === best,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleWidths: [1, 2, 3],
  masterWidths: [0, 1, 2, 3, 0],
  callerCandidateOffsets: [0, 1, 2],
} satisfies Input;
export const exampleOutput = {
  candidateCorrelations: [1, 1, -0.6546536707079771],
  bestOffsets: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/dendrochronology-cross-dating",
  title: "Geology Dendrochronology Cross Dating Calculator",
  description:
    "Bounded actual ring-width candidate crossdating Pearson correlation; tied offsets retained, chronology/authenticity not established. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "candidateCorrelations",
      label: "Candidate correlations",
      kind: "numberList",
    },
    { id: "bestOffsets", label: "Best offsets", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      sampleWidths: value.sampleWidths as readonly number[],
      masterWidths: value.masterWidths as readonly number[],
      callerCandidateOffsets: value.callerCandidateOffsets as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
