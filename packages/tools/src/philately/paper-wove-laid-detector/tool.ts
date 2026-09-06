import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerPaperStructureClassIds: readonly string[];
  readonly callerPaperStructureRequirements: readonly (readonly number[])[];
  readonly observedPaperStructureEvidence: readonly number[];
  readonly knownPaperStructureFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPaperStructureClassIds",
    label: "Caller paper structure class ids",
    kind: "stringList",
  },
  {
    id: "callerPaperStructureRequirements",
    label: "Caller paper structure requirements",
    kind: "matrix",
  },
  {
    id: "observedPaperStructureEvidence",
    label: "Observed paper structure evidence",
    kind: "numberList",
  },
  {
    id: "knownPaperStructureFlags",
    label: "Known paper structure flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPaperStructureClassIds,
    input.callerPaperStructureRequirements,
    input.observedPaperStructureEvidence,
    input.knownPaperStructureFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPaperStructureClassIds: ["a", "b"],
  callerPaperStructureRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPaperStructureEvidence: [1, 0],
  knownPaperStructureFlags: [1, 0],
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
  id: "philately/paper-wove-laid-detector",
  title: "Paper Type Identifier Wove versus Laid Detector",
  description:
    "Classify supplied paper structure evidence against caller matched wove/laid positive witness criteria. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerPaperStructureClassIds:
        value.callerPaperStructureClassIds as readonly string[],
      callerPaperStructureRequirements:
        value.callerPaperStructureRequirements as readonly (readonly number[])[],
      observedPaperStructureEvidence:
        value.observedPaperStructureEvidence as readonly number[],
      knownPaperStructureFlags:
        value.knownPaperStructureFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
