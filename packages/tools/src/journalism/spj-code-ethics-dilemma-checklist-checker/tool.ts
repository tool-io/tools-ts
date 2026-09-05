import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerEthicsReviewClassIds: readonly string[];
  readonly callerEthicsReviewRequirements: readonly (readonly number[])[];
  readonly observedEthicsReviewEvidence: readonly number[];
  readonly knownEthicsReviewFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerEthicsReviewClassIds",
    label: "Caller ethics review class ids",
    kind: "stringList",
  },
  {
    id: "callerEthicsReviewRequirements",
    label: "Caller ethics review requirements",
    kind: "matrix",
  },
  {
    id: "observedEthicsReviewEvidence",
    label: "Observed ethics review evidence",
    kind: "numberList",
  },
  {
    id: "knownEthicsReviewFlags",
    label: "Known ethics review flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerEthicsReviewClassIds,
    input.callerEthicsReviewRequirements,
    input.observedEthicsReviewEvidence,
    input.knownEthicsReviewFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEthicsReviewClassIds: ["a", "b"],
  callerEthicsReviewRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedEthicsReviewEvidence: [1, 0],
  knownEthicsReviewFlags: [1, 0],
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
  id: "journalism/spj-code-ethics-dilemma-checklist-checker",
  title: "SPJ Code Ethics Dilemma Checklist Checker",
  description:
    "Caller independently edition-verified SPJ seek-truth/minimize-harm/independence/account ability evidence requirements, not automatic ethical clearance. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerEthicsReviewClassIds:
        value.callerEthicsReviewClassIds as readonly string[],
      callerEthicsReviewRequirements:
        value.callerEthicsReviewRequirements as readonly (readonly number[])[],
      observedEthicsReviewEvidence:
        value.observedEthicsReviewEvidence as readonly number[],
      knownEthicsReviewFlags: value.knownEthicsReviewFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
