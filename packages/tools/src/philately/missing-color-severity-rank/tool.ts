import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerMissingColorClassIds: readonly string[];
  readonly callerMissingColorRequirements: readonly (readonly number[])[];
  readonly observedMissingColorEvidence: readonly number[];
  readonly knownMissingColorFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerMissingColorClassIds",
    label: "Caller missing color class ids",
    kind: "stringList",
  },
  {
    id: "callerMissingColorRequirements",
    label: "Caller missing color requirements",
    kind: "matrix",
  },
  {
    id: "observedMissingColorEvidence",
    label: "Observed missing color evidence",
    kind: "numberList",
  },
  {
    id: "knownMissingColorFlags",
    label: "Known missing color flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerMissingColorClassIds,
    input.callerMissingColorRequirements,
    input.observedMissingColorEvidence,
    input.knownMissingColorFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMissingColorClassIds: ["a", "b"],
  callerMissingColorRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedMissingColorEvidence: [1, 0],
  knownMissingColorFlags: [1, 0],
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
  id: "philately/missing-color-severity-rank",
  title: "Missing Color Error Severity Rank Checker",
  description:
    "Compare independently verified color absence evidence, not scanner RGB-based error authentication. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerMissingColorClassIds:
        value.callerMissingColorClassIds as readonly string[],
      callerMissingColorRequirements:
        value.callerMissingColorRequirements as readonly (readonly number[])[],
      observedMissingColorEvidence:
        value.observedMissingColorEvidence as readonly number[],
      knownMissingColorFlags: value.knownMissingColorFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
