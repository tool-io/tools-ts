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
  aligned,
  binary,
  unique,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerCandidateCutIds: readonly string[];
  readonly candidateCutBarCounts: readonly number[];
  readonly candidateDurationSeconds: readonly number[];
  readonly callerPermittedBarCounts: readonly number[];
  readonly callerMaximumCutDurationSeconds: number;
  readonly candidateMusicalBoundaryVerifiedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly eligibleCallerCutIds: readonly string[];
  readonly cutIdsOverCallerTimeLimit: readonly string[];
  readonly cutIdsWithoutVerifiedBoundary: readonly string[];
}>;
const inputFields = [
  {
    id: "callerCandidateCutIds",
    label: "Caller candidate cut ids",
    kind: "stringList",
  },
  {
    id: "candidateCutBarCounts",
    label: "Candidate cut bar counts",
    kind: "numberList",
  },
  {
    id: "candidateDurationSeconds",
    label: "Candidate duration seconds",
    kind: "numberList",
  },
  {
    id: "callerPermittedBarCounts",
    label: "Caller permitted bar counts",
    kind: "numberList",
  },
  {
    id: "callerMaximumCutDurationSeconds",
    label: "Caller maximum cut duration seconds",
    kind: "number",
  },
  {
    id: "candidateMusicalBoundaryVerifiedFlags",
    label: "Candidate musical boundary verified flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.candidateDurationSeconds.forEach((v) =>
    positive(v, "candidateDurationSeconds"),
  );
  positive(
    input.callerMaximumCutDurationSeconds,
    "callerMaximumCutDurationSeconds",
  );
  binary(
    input.candidateMusicalBoundaryVerifiedFlags,
    "candidateMusicalBoundaryVerifiedFlags",
  );
  aligned(
    input.callerCandidateCutIds,
    input.candidateCutBarCounts,
    "callerCandidateCutIds",
  );
  aligned(
    input.callerCandidateCutIds,
    input.candidateDurationSeconds,
    "callerCandidateCutIds",
  );
  aligned(
    input.callerCandidateCutIds,
    input.candidateMusicalBoundaryVerifiedFlags,
    "callerCandidateCutIds",
  );
  unique(input.callerCandidateCutIds, "cuts");
  if (!input.callerPermittedBarCounts.length)
    simpleError("rules", "Caller permitted cut bar lengths required.");
  [...input.candidateCutBarCounts, ...input.callerPermittedBarCounts].forEach(
    (v) => bounded(v, "bars", 1, 128),
  );
  return {
    eligibleCallerCutIds: input.callerCandidateCutIds.filter(
      (_, i) =>
        input.callerPermittedBarCounts.includes(
          input.candidateCutBarCounts[i],
        ) &&
        input.candidateDurationSeconds[i] <=
          input.callerMaximumCutDurationSeconds &&
        input.candidateMusicalBoundaryVerifiedFlags[i] === 1,
    ),
    cutIdsOverCallerTimeLimit: input.callerCandidateCutIds.filter(
      (_, i) =>
        input.candidateDurationSeconds[i] >
        input.callerMaximumCutDurationSeconds,
    ),
    cutIdsWithoutVerifiedBoundary: input.callerCandidateCutIds.filter(
      (_, i) => !input.candidateMusicalBoundaryVerifiedFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCandidateCutIds: ["A", "B", "C"],
  candidateCutBarCounts: [16, 32, 16],
  candidateDurationSeconds: [30, 65, 45],
  callerPermittedBarCounts: [16, 32],
  callerMaximumCutDurationSeconds: 40,
  candidateMusicalBoundaryVerifiedFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  eligibleCallerCutIds: ["A"],
  cutIdsOverCallerTimeLimit: ["B", "C"],
  cutIdsWithoutVerifiedBoundary: ["C"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/audition-cut-16-or-32-bar-selection-guide",
  title: "Audition Cut 16 Or 32 Bar Selection Guide",
  description:
    "Screen actual annotated audition cut candidates against caller permitted bar lengths/time and independently verified musical boundaries; no selecting cut from raw music, universal 16/32 rule or artistic appropriateness.",
  inputs: inputFields,
  outputs: [
    {
      id: "eligibleCallerCutIds",
      label: "Eligible caller cut ids",
      kind: "stringList",
    },
    {
      id: "cutIdsOverCallerTimeLimit",
      label: "Cut ids over caller time limit",
      kind: "stringList",
    },
    {
      id: "cutIdsWithoutVerifiedBoundary",
      label: "Cut ids without verified boundary",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCandidateCutIds: value.callerCandidateCutIds as readonly string[],
      candidateCutBarCounts: value.candidateCutBarCounts as readonly number[],
      candidateDurationSeconds:
        value.candidateDurationSeconds as readonly number[],
      callerPermittedBarCounts:
        value.callerPermittedBarCounts as readonly number[],
      callerMaximumCutDurationSeconds:
        value.callerMaximumCutDurationSeconds as number,
      candidateMusicalBoundaryVerifiedFlags:
        value.candidateMusicalBoundaryVerifiedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
