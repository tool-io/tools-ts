import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerAnonymousSourceClassIds: readonly string[];
  readonly callerAnonymousSourceRequirements: readonly (readonly number[])[];
  readonly observedAnonymousSourceEvidence: readonly number[];
  readonly knownAnonymousSourceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerAnonymousSourceClassIds",
    label: "Caller anonymous source class ids",
    kind: "stringList",
  },
  {
    id: "callerAnonymousSourceRequirements",
    label: "Caller anonymous source requirements",
    kind: "matrix",
  },
  {
    id: "observedAnonymousSourceEvidence",
    label: "Observed anonymous source evidence",
    kind: "numberList",
  },
  {
    id: "knownAnonymousSourceFlags",
    label: "Known anonymous source flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerAnonymousSourceClassIds,
    input.callerAnonymousSourceRequirements,
    input.observedAnonymousSourceEvidence,
    input.knownAnonymousSourceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAnonymousSourceClassIds: ["a", "b"],
  callerAnonymousSourceRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedAnonymousSourceEvidence: [1, 0],
  knownAnonymousSourceFlags: [1, 0],
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
  id: "journalism/anonymous-source-justification-editorial-checklist",
  title: "Anonymous Source Justification Editorial Checklist",
  description:
    "Caller independently verified knowledge, corroboration, motive, necessity and editor authorization criteria for anonymous source review; anonymity alone not credibility. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerAnonymousSourceClassIds:
        value.callerAnonymousSourceClassIds as readonly string[],
      callerAnonymousSourceRequirements:
        value.callerAnonymousSourceRequirements as readonly (readonly number[])[],
      observedAnonymousSourceEvidence:
        value.observedAnonymousSourceEvidence as readonly number[],
      knownAnonymousSourceFlags:
        value.knownAnonymousSourceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
