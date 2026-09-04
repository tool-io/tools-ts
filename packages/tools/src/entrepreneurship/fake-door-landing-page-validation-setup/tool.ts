import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerFakeDoorExperimentClassIds: readonly string[];
  readonly callerFakeDoorExperimentRequirements: readonly (readonly number[])[];
  readonly observedFakeDoorExperimentEvidence: readonly number[];
  readonly knownFakeDoorExperimentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerFakeDoorExperimentClassIds",
    label: "Caller fake door experiment class ids",
    kind: "stringList",
  },
  {
    id: "callerFakeDoorExperimentRequirements",
    label: "Caller fake door experiment requirements",
    kind: "matrix",
  },
  {
    id: "observedFakeDoorExperimentEvidence",
    label: "Observed fake door experiment evidence",
    kind: "numberList",
  },
  {
    id: "knownFakeDoorExperimentFlags",
    label: "Known fake door experiment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerFakeDoorExperimentClassIds,
    input.callerFakeDoorExperimentRequirements,
    input.observedFakeDoorExperimentEvidence,
    input.knownFakeDoorExperimentFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFakeDoorExperimentClassIds: ["a", "b"],
  callerFakeDoorExperimentRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedFakeDoorExperimentEvidence: [1, 0],
  knownFakeDoorExperimentFlags: [1, 0],
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
  id: "entrepreneurship/fake-door-landing-page-validation-setup",
  title: "Fake Door Landing Page Validation Setup",
  description:
    "Caller independently verified audience/measurement/consent/nondeceptive follow-up fake-door experiment requirements, no instruction to collect payments for nonexistent fulfillment. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerFakeDoorExperimentClassIds:
        value.callerFakeDoorExperimentClassIds as readonly string[],
      callerFakeDoorExperimentRequirements:
        value.callerFakeDoorExperimentRequirements as readonly (readonly number[])[],
      observedFakeDoorExperimentEvidence:
        value.observedFakeDoorExperimentEvidence as readonly number[],
      knownFakeDoorExperimentFlags:
        value.knownFakeDoorExperimentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
