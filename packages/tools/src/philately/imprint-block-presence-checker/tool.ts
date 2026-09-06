import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerImprintLocationClassIds: readonly string[];
  readonly callerImprintLocationRequirements: readonly (readonly number[])[];
  readonly observedImprintLocationEvidence: readonly number[];
  readonly knownImprintLocationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerImprintLocationClassIds",
    label: "Caller imprint location class ids",
    kind: "stringList",
  },
  {
    id: "callerImprintLocationRequirements",
    label: "Caller imprint location requirements",
    kind: "matrix",
  },
  {
    id: "observedImprintLocationEvidence",
    label: "Observed imprint location evidence",
    kind: "numberList",
  },
  {
    id: "knownImprintLocationFlags",
    label: "Known imprint location flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerImprintLocationClassIds,
    input.callerImprintLocationRequirements,
    input.observedImprintLocationEvidence,
    input.knownImprintLocationFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerImprintLocationClassIds: ["a", "b"],
  callerImprintLocationRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedImprintLocationEvidence: [1, 0],
  knownImprintLocationFlags: [1, 0],
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
  id: "philately/imprint-block-presence-checker",
  title: "Imprint Block Presence Bottom Margin Checker",
  description:
    "Compare independently observed imprint presence/location witnesses against caller issue record. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerImprintLocationClassIds:
        value.callerImprintLocationClassIds as readonly string[],
      callerImprintLocationRequirements:
        value.callerImprintLocationRequirements as readonly (readonly number[])[],
      observedImprintLocationEvidence:
        value.observedImprintLocationEvidence as readonly number[],
      knownImprintLocationFlags:
        value.knownImprintLocationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
