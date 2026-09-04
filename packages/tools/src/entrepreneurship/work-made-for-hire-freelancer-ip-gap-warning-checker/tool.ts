import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerFreelancerIpClassIds: readonly string[];
  readonly callerFreelancerIpRequirements: readonly (readonly number[])[];
  readonly observedFreelancerIpEvidence: readonly number[];
  readonly knownFreelancerIpFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerFreelancerIpClassIds",
    label: "Caller freelancer ip class ids",
    kind: "stringList",
  },
  {
    id: "callerFreelancerIpRequirements",
    label: "Caller freelancer ip requirements",
    kind: "matrix",
  },
  {
    id: "observedFreelancerIpEvidence",
    label: "Observed freelancer ip evidence",
    kind: "numberList",
  },
  {
    id: "knownFreelancerIpFlags",
    label: "Known freelancer ip flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerFreelancerIpClassIds,
    input.callerFreelancerIpRequirements,
    input.observedFreelancerIpEvidence,
    input.knownFreelancerIpFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFreelancerIpClassIds: ["a", "b"],
  callerFreelancerIpRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedFreelancerIpEvidence: [1, 0],
  knownFreelancerIpFlags: [1, 0],
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
  id: "entrepreneurship/work-made-for-hire-freelancer-ip-gap-warning-checker",
  title: "Work Made For Hire Freelancer IP Gap Warning Checker",
  description:
    "Independent assignment/work-for-hire contractual evidence vs caller applicable contributor/IP requirements; work-for-hire label alone not ownership proof. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerFreelancerIpClassIds:
        value.callerFreelancerIpClassIds as readonly string[],
      callerFreelancerIpRequirements:
        value.callerFreelancerIpRequirements as readonly (readonly number[])[],
      observedFreelancerIpEvidence:
        value.observedFreelancerIpEvidence as readonly number[],
      knownFreelancerIpFlags: value.knownFreelancerIpFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
