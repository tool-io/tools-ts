import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerPerforationPatternClassIds: readonly string[];
  readonly callerPerforationPatternRequirements: readonly (readonly number[])[];
  readonly observedPerforationPatternEvidence: readonly number[];
  readonly knownPerforationPatternFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPerforationPatternClassIds",
    label: "Caller perforation pattern class ids",
    kind: "stringList",
  },
  {
    id: "callerPerforationPatternRequirements",
    label: "Caller perforation pattern requirements",
    kind: "matrix",
  },
  {
    id: "observedPerforationPatternEvidence",
    label: "Observed perforation pattern evidence",
    kind: "numberList",
  },
  {
    id: "knownPerforationPatternFlags",
    label: "Known perforation pattern flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPerforationPatternClassIds,
    input.callerPerforationPatternRequirements,
    input.observedPerforationPatternEvidence,
    input.knownPerforationPatternFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPerforationPatternClassIds: ["a", "b"],
  callerPerforationPatternRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPerforationPatternEvidence: [1, 0],
  knownPerforationPatternFlags: [1, 0],
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
  id: "philately/line-comb-perf-classifier",
  title: "Line vs Comb Perf Classifier from Pattern Notes",
  description:
    "Compare recorded corner alignment and repeated-row comb evidence, not free-text certainty. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerPerforationPatternClassIds:
        value.callerPerforationPatternClassIds as readonly string[],
      callerPerforationPatternRequirements:
        value.callerPerforationPatternRequirements as readonly (readonly number[])[],
      observedPerforationPatternEvidence:
        value.observedPerforationPatternEvidence as readonly number[],
      knownPerforationPatternFlags:
        value.knownPerforationPatternFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
