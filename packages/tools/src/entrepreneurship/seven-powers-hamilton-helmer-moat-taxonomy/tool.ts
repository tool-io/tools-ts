import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerSevenPowersClassIds: readonly string[];
  readonly callerSevenPowersRequirements: readonly (readonly number[])[];
  readonly observedSevenPowersEvidence: readonly number[];
  readonly knownSevenPowersFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerSevenPowersClassIds",
    label: "Caller seven powers class ids",
    kind: "stringList",
  },
  {
    id: "callerSevenPowersRequirements",
    label: "Caller seven powers requirements",
    kind: "matrix",
  },
  {
    id: "observedSevenPowersEvidence",
    label: "Observed seven powers evidence",
    kind: "numberList",
  },
  {
    id: "knownSevenPowersFlags",
    label: "Known seven powers flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerSevenPowersClassIds,
    input.callerSevenPowersRequirements,
    input.observedSevenPowersEvidence,
    input.knownSevenPowersFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSevenPowersClassIds: ["a", "b"],
  callerSevenPowersRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedSevenPowersEvidence: [1, 0],
  knownSevenPowersFlags: [1, 0],
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
  id: "entrepreneurship/seven-powers-hamilton-helmer-moat-taxonomy",
  title: "Seven Powers Hamilton Helmer Moat Taxonomy",
  description:
    "Caller independently documented evidence for named moat criteria; market positioning or power not established from score. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerSevenPowersClassIds:
        value.callerSevenPowersClassIds as readonly string[],
      callerSevenPowersRequirements:
        value.callerSevenPowersRequirements as readonly (readonly number[])[],
      observedSevenPowersEvidence:
        value.observedSevenPowersEvidence as readonly number[],
      knownSevenPowersFlags: value.knownSevenPowersFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
