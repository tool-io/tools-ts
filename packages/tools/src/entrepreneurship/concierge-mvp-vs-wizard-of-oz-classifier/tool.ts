import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerMvpOperationClassIds: readonly string[];
  readonly callerMvpOperationRequirements: readonly (readonly number[])[];
  readonly observedMvpOperationEvidence: readonly number[];
  readonly knownMvpOperationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerMvpOperationClassIds",
    label: "Caller mvp operation class ids",
    kind: "stringList",
  },
  {
    id: "callerMvpOperationRequirements",
    label: "Caller mvp operation requirements",
    kind: "matrix",
  },
  {
    id: "observedMvpOperationEvidence",
    label: "Observed mvp operation evidence",
    kind: "numberList",
  },
  {
    id: "knownMvpOperationFlags",
    label: "Known mvp operation flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerMvpOperationClassIds,
    input.callerMvpOperationRequirements,
    input.observedMvpOperationEvidence,
    input.knownMvpOperationFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMvpOperationClassIds: ["a", "b"],
  callerMvpOperationRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedMvpOperationEvidence: [1, 0],
  knownMvpOperationFlags: [1, 0],
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
  id: "entrepreneurship/concierge-mvp-vs-wizard-of-oz-classifier",
  title: "Concierge Mvp vs Wizard of Oz Classifier",
  description:
    "Observed disclosed human/manual vs user-visible automation requirements for caller concierge/Wizard-ofOzprototype classes. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerMvpOperationClassIds:
        value.callerMvpOperationClassIds as readonly string[],
      callerMvpOperationRequirements:
        value.callerMvpOperationRequirements as readonly (readonly number[])[],
      observedMvpOperationEvidence:
        value.observedMvpOperationEvidence as readonly number[],
      knownMvpOperationFlags: value.knownMvpOperationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
