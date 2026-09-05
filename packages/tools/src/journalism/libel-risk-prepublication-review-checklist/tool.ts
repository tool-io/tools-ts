import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerLibelReviewClassIds: readonly string[];
  readonly callerLibelReviewRequirements: readonly (readonly number[])[];
  readonly observedLibelReviewEvidence: readonly number[];
  readonly knownLibelReviewFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerLibelReviewClassIds",
    label: "Caller libel review class ids",
    kind: "stringList",
  },
  {
    id: "callerLibelReviewRequirements",
    label: "Caller libel review requirements",
    kind: "matrix",
  },
  {
    id: "observedLibelReviewEvidence",
    label: "Observed libel review evidence",
    kind: "numberList",
  },
  {
    id: "knownLibelReviewFlags",
    label: "Known libel review flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerLibelReviewClassIds,
    input.callerLibelReviewRequirements,
    input.observedLibelReviewEvidence,
    input.knownLibelReviewFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLibelReviewClassIds: ["a", "b"],
  callerLibelReviewRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedLibelReviewEvidence: [1, 0],
  knownLibelReviewFlags: [1, 0],
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
  id: "journalism/libel-risk-prepublication-review-checklist",
  title: "Libel Risk Prepublication Review Checklist",
  description:
    "Caller independently documented assertion, identification, verification and applicable legal-review facts, not a liability verdict. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerLibelReviewClassIds:
        value.callerLibelReviewClassIds as readonly string[],
      callerLibelReviewRequirements:
        value.callerLibelReviewRequirements as readonly (readonly number[])[],
      observedLibelReviewEvidence:
        value.observedLibelReviewEvidence as readonly number[],
      knownLibelReviewFlags: value.knownLibelReviewFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
