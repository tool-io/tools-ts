import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerCachetTypeClassIds: readonly string[];
  readonly callerCachetTypeRequirements: readonly (readonly number[])[];
  readonly observedCachetTypeEvidence: readonly number[];
  readonly knownCachetTypeFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerCachetTypeClassIds",
    label: "Caller cachet type class ids",
    kind: "stringList",
  },
  {
    id: "callerCachetTypeRequirements",
    label: "Caller cachet type requirements",
    kind: "matrix",
  },
  {
    id: "observedCachetTypeEvidence",
    label: "Observed cachet type evidence",
    kind: "numberList",
  },
  {
    id: "knownCachetTypeFlags",
    label: "Known cachet type flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerCachetTypeClassIds,
    input.callerCachetTypeRequirements,
    input.observedCachetTypeEvidence,
    input.knownCachetTypeFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCachetTypeClassIds: ["a", "b"],
  callerCachetTypeRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedCachetTypeEvidence: [1, 0],
  knownCachetTypeFlags: [1, 0],
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
  id: "philately/cachet-type-note-classifier",
  title: "Cachet Presence and Type Note Classifier",
  description:
    "Compare independently annotated cachet presence/type witnesses; no semantic classification of arbitrary notes. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerCachetTypeClassIds:
        value.callerCachetTypeClassIds as readonly string[],
      callerCachetTypeRequirements:
        value.callerCachetTypeRequirements as readonly (readonly number[])[],
      observedCachetTypeEvidence:
        value.observedCachetTypeEvidence as readonly number[],
      knownCachetTypeFlags: value.knownCachetTypeFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
