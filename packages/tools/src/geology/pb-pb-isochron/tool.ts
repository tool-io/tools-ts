import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  linearFit,
  crossings,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly pb206Pb204: readonly number[];
  readonly pb207Pb204: readonly number[];
  readonly candidateAges: readonly number[];
  readonly callerConcordantRadiogenicSlopes: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedPbSlope: number;
  readonly matchedCandidateAges: readonly number[];
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "pb206Pb204", label: "Pb206 pb204", kind: "numberList" },
  { id: "pb207Pb204", label: "Pb207 pb204", kind: "numberList" },
  { id: "candidateAges", label: "Candidate ages", kind: "numberList" },
  {
    id: "callerConcordantRadiogenicSlopes",
    label: "Caller concordant radiogenic slopes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const f = linearFit(input.pb206Pb204, input.pb207Pb204);
  return {
    fittedPbSlope: f.slope,
    matchedCandidateAges: crossings(
      input.candidateAges,
      input.callerConcordantRadiogenicSlopes,
      f.slope,
    ),
    fitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pb206Pb204: [1, 2, 3],
  pb207Pb204: [2, 4, 6],
  candidateAges: [0, 1, 2],
  callerConcordantRadiogenicSlopes: [1, 2, 4],
} satisfies Input;
export const exampleOutput = {
  fittedPbSlope: 2,
  matchedCandidateAges: [1],
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/pb-pb-isochron",
  title: "Geology Pb Pb Isochron Calculator",
  description:
    "Fit actual Pb–Pb isotope array then invert independently verified radiogenic slope/age curve (same U isotope ratio/decay constants); no log1p applied to Pb–Pb slope. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "fittedPbSlope", label: "Fitted pb slope", kind: "number" },
    {
      id: "matchedCandidateAges",
      label: "Matched candidate ages",
      kind: "numberList",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      pb206Pb204: value.pb206Pb204 as readonly number[],
      pb207Pb204: value.pb207Pb204 as readonly number[],
      candidateAges: value.candidateAges as readonly number[],
      callerConcordantRadiogenicSlopes:
        value.callerConcordantRadiogenicSlopes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
