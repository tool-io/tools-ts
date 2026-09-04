import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerNorthStarCandidateClassIds: readonly string[];
  readonly callerNorthStarCandidateRequirements: readonly (readonly number[])[];
  readonly observedNorthStarCandidateEvidence: readonly number[];
  readonly knownNorthStarCandidateFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerNorthStarCandidateClassIds",
    label: "Caller north star candidate class ids",
    kind: "stringList",
  },
  {
    id: "callerNorthStarCandidateRequirements",
    label: "Caller north star candidate requirements",
    kind: "matrix",
  },
  {
    id: "observedNorthStarCandidateEvidence",
    label: "Observed north star candidate evidence",
    kind: "numberList",
  },
  {
    id: "knownNorthStarCandidateFlags",
    label: "Known north star candidate flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerNorthStarCandidateClassIds,
    input.callerNorthStarCandidateRequirements,
    input.observedNorthStarCandidateEvidence,
    input.knownNorthStarCandidateFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerNorthStarCandidateClassIds: ["a", "b"],
  callerNorthStarCandidateRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedNorthStarCandidateEvidence: [1, 0],
  knownNorthStarCandidateFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  compatibleCallerClasses: ["a", "b"],
  fullyWitnessedCallerClasses: ["a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/north-star-metric-selection-tree",
  title: "North Star Metric Selection Tree",
  description:
    "Caller independently documented delivered-value/controllability/measurement evidence against candidate NorthStarcriteria, not a universal metric-selection tree. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleCallerClasses",
      label: "Compatible caller classes",
      kind: "stringList",
    },
    {
      id: "fullyWitnessedCallerClasses",
      label: "Fully witnessed caller classes",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerNorthStarCandidateClassIds:
        value.callerNorthStarCandidateClassIds as readonly string[],
      callerNorthStarCandidateRequirements:
        value.callerNorthStarCandidateRequirements as readonly (readonly number[])[],
      observedNorthStarCandidateEvidence:
        value.observedNorthStarCandidateEvidence as readonly number[],
      knownNorthStarCandidateFlags:
        value.knownNorthStarCandidateFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
