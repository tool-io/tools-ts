import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerObservedRopeyBroodClassIds: readonly string[];
  readonly callerObservedRopeyBroodRequirements: readonly (readonly number[])[];
  readonly observedObservedRopeyBroodEvidence: readonly number[];
  readonly knownObservedRopeyBroodFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerObservedRopeyBroodClassIds",
    label: "Caller observed ropey brood class ids",
    kind: "stringList",
  },
  {
    id: "callerObservedRopeyBroodRequirements",
    label: "Caller observed ropey brood requirements",
    kind: "matrix",
  },
  {
    id: "observedObservedRopeyBroodEvidence",
    label: "Observed observed ropey brood evidence",
    kind: "numberList",
  },
  {
    id: "knownObservedRopeyBroodFlags",
    label: "Known observed ropey brood flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerObservedRopeyBroodClassIds,
    input.callerObservedRopeyBroodRequirements,
    input.observedObservedRopeyBroodEvidence,
    input.knownObservedRopeyBroodFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedRopeyBroodClassIds: ["a", "b"],
  callerObservedRopeyBroodRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedObservedRopeyBroodEvidence: [1, 0],
  knownObservedRopeyBroodFlags: [1, 0],
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
  id: "apiculture/afb-ropey-matchstick-test-checker",
  title: "AFB Ropey Matchstick Test Checker",
  description:
    "Caller independently observed brood texture/test evidence vs applicable veterinary/laboratory referral criteria; ropey observation alone does not diagnoseAFB. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerObservedRopeyBroodClassIds:
        value.callerObservedRopeyBroodClassIds as readonly string[],
      callerObservedRopeyBroodRequirements:
        value.callerObservedRopeyBroodRequirements as readonly (readonly number[])[],
      observedObservedRopeyBroodEvidence:
        value.observedObservedRopeyBroodEvidence as readonly number[],
      knownObservedRopeyBroodFlags:
        value.knownObservedRopeyBroodFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
