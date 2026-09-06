import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerCinderellaPurposeClassIds: readonly string[];
  readonly callerCinderellaPurposeRequirements: readonly (readonly number[])[];
  readonly observedCinderellaPurposeEvidence: readonly number[];
  readonly knownCinderellaPurposeFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerCinderellaPurposeClassIds",
    label: "Caller cinderella purpose class ids",
    kind: "stringList",
  },
  {
    id: "callerCinderellaPurposeRequirements",
    label: "Caller cinderella purpose requirements",
    kind: "matrix",
  },
  {
    id: "observedCinderellaPurposeEvidence",
    label: "Observed cinderella purpose evidence",
    kind: "numberList",
  },
  {
    id: "knownCinderellaPurposeFlags",
    label: "Known cinderella purpose flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerCinderellaPurposeClassIds,
    input.callerCinderellaPurposeRequirements,
    input.observedCinderellaPurposeEvidence,
    input.knownCinderellaPurposeFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCinderellaPurposeClassIds: ["a", "b"],
  callerCinderellaPurposeRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedCinderellaPurposeEvidence: [1, 0],
  knownCinderellaPurposeFlags: [1, 0],
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
  id: "philately/cinderella-exclusion-flag-checker",
  title: "Cinderella Status Exclusion Flag Checker",
  description:
    "Compare caller purpose/franking evidence against independently verified exclusion classes. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerCinderellaPurposeClassIds:
        value.callerCinderellaPurposeClassIds as readonly string[],
      callerCinderellaPurposeRequirements:
        value.callerCinderellaPurposeRequirements as readonly (readonly number[])[],
      observedCinderellaPurposeEvidence:
        value.observedCinderellaPurposeEvidence as readonly number[],
      knownCinderellaPurposeFlags:
        value.knownCinderellaPurposeFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
