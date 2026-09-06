import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerPrecancelStyleClassIds: readonly string[];
  readonly callerPrecancelStyleRequirements: readonly (readonly number[])[];
  readonly observedPrecancelStyleEvidence: readonly number[];
  readonly knownPrecancelStyleFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPrecancelStyleClassIds",
    label: "Caller precancel style class ids",
    kind: "stringList",
  },
  {
    id: "callerPrecancelStyleRequirements",
    label: "Caller precancel style requirements",
    kind: "matrix",
  },
  {
    id: "observedPrecancelStyleEvidence",
    label: "Observed precancel style evidence",
    kind: "numberList",
  },
  {
    id: "knownPrecancelStyleFlags",
    label: "Known precancel style flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPrecancelStyleClassIds,
    input.callerPrecancelStyleRequirements,
    input.observedPrecancelStyleEvidence,
    input.knownPrecancelStyleFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPrecancelStyleClassIds: ["a", "b"],
  callerPrecancelStyleRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPrecancelStyleEvidence: [1, 0],
  knownPrecancelStyleFlags: [1, 0],
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
  id: "philately/precancel-style-classifier",
  title: "Precancel Style Classifier (bullet/bar/target)",
  description:
    "Compare already observed bullet/bar/target precancel features with independently established caller classes. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerPrecancelStyleClassIds:
        value.callerPrecancelStyleClassIds as readonly string[],
      callerPrecancelStyleRequirements:
        value.callerPrecancelStyleRequirements as readonly (readonly number[])[],
      observedPrecancelStyleEvidence:
        value.observedPrecancelStyleEvidence as readonly number[],
      knownPrecancelStyleFlags:
        value.knownPrecancelStyleFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
