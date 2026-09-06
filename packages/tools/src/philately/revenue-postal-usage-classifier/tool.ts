import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerUsageClassIds: readonly string[];
  readonly callerUsageRequirements: readonly (readonly number[])[];
  readonly observedUsageEvidence: readonly number[];
  readonly knownUsageFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerUsageClassIds",
    label: "Caller usage class ids",
    kind: "stringList",
  },
  {
    id: "callerUsageRequirements",
    label: "Caller usage requirements",
    kind: "matrix",
  },
  {
    id: "observedUsageEvidence",
    label: "Observed usage evidence",
    kind: "numberList",
  },
  { id: "knownUsageFlags", label: "Known usage flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerUsageClassIds,
    input.callerUsageRequirements,
    input.observedUsageEvidence,
    input.knownUsageFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerUsageClassIds: ["a", "b"],
  callerUsageRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedUsageEvidence: [1, 0],
  knownUsageFlags: [1, 0],
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
  id: "philately/revenue-postal-usage-classifier",
  title: "Revenue Stamp versus Postal Usage Classifier",
  description:
    "Compare independently documented revenue/postal purpose evidence, preserving ambiguous matches. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerUsageClassIds: value.callerUsageClassIds as readonly string[],
      callerUsageRequirements:
        value.callerUsageRequirements as readonly (readonly number[])[],
      observedUsageEvidence: value.observedUsageEvidence as readonly number[],
      knownUsageFlags: value.knownUsageFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
