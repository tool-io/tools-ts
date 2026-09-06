import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerPrintingMethodClassIds: readonly string[];
  readonly callerPrintingMethodRequirements: readonly (readonly number[])[];
  readonly observedPrintingMethodEvidence: readonly number[];
  readonly knownPrintingMethodFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPrintingMethodClassIds",
    label: "Caller printing method class ids",
    kind: "stringList",
  },
  {
    id: "callerPrintingMethodRequirements",
    label: "Caller printing method requirements",
    kind: "matrix",
  },
  {
    id: "observedPrintingMethodEvidence",
    label: "Observed printing method evidence",
    kind: "numberList",
  },
  {
    id: "knownPrintingMethodFlags",
    label: "Known printing method flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPrintingMethodClassIds,
    input.callerPrintingMethodRequirements,
    input.observedPrintingMethodEvidence,
    input.knownPrintingMethodFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPrintingMethodClassIds: ["a", "b"],
  callerPrintingMethodRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPrintingMethodEvidence: [1, 0],
  knownPrintingMethodFlags: [1, 0],
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
  id: "philately/printing-method-decision-tree",
  title: "Printing Method Identifier (recess/litho/typo) Decision Tree",
  description:
    "Compare observed recess/lithographic/letterpress positive evidence against independently verified class requirements; no false single-winner tree. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerPrintingMethodClassIds:
        value.callerPrintingMethodClassIds as readonly string[],
      callerPrintingMethodRequirements:
        value.callerPrintingMethodRequirements as readonly (readonly number[])[],
      observedPrintingMethodEvidence:
        value.observedPrintingMethodEvidence as readonly number[],
      knownPrintingMethodFlags:
        value.knownPrintingMethodFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
