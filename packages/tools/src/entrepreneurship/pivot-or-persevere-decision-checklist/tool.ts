import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerPivotPersevereClassIds: readonly string[];
  readonly callerPivotPersevereRequirements: readonly (readonly number[])[];
  readonly observedPivotPersevereEvidence: readonly number[];
  readonly knownPivotPersevereFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPivotPersevereClassIds",
    label: "Caller pivot persevere class ids",
    kind: "stringList",
  },
  {
    id: "callerPivotPersevereRequirements",
    label: "Caller pivot persevere requirements",
    kind: "matrix",
  },
  {
    id: "observedPivotPersevereEvidence",
    label: "Observed pivot persevere evidence",
    kind: "numberList",
  },
  {
    id: "knownPivotPersevereFlags",
    label: "Known pivot persevere flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPivotPersevereClassIds,
    input.callerPivotPersevereRequirements,
    input.observedPivotPersevereEvidence,
    input.knownPivotPersevereFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPivotPersevereClassIds: ["a", "b"],
  callerPivotPersevereRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPivotPersevereEvidence: [1, 0],
  knownPivotPersevereFlags: [1, 0],
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
  id: "entrepreneurship/pivot-or-persevere-decision-checklist",
  title: "Pivot Or Persevere Decision Checklist",
  description:
    "Caller explicitly evidence-backed learning/retention/unit-economics decision criteria, unknowns retained rather than prescribing pivot. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerPivotPersevereClassIds:
        value.callerPivotPersevereClassIds as readonly string[],
      callerPivotPersevereRequirements:
        value.callerPivotPersevereRequirements as readonly (readonly number[])[],
      observedPivotPersevereEvidence:
        value.observedPivotPersevereEvidence as readonly number[],
      knownPivotPersevereFlags:
        value.knownPivotPersevereFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
