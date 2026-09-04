import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerNetworkEffectClassIds: readonly string[];
  readonly callerNetworkEffectRequirements: readonly (readonly number[])[];
  readonly observedNetworkEffectEvidence: readonly number[];
  readonly knownNetworkEffectFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerNetworkEffectClassIds",
    label: "Caller network effect class ids",
    kind: "stringList",
  },
  {
    id: "callerNetworkEffectRequirements",
    label: "Caller network effect requirements",
    kind: "matrix",
  },
  {
    id: "observedNetworkEffectEvidence",
    label: "Observed network effect evidence",
    kind: "numberList",
  },
  {
    id: "knownNetworkEffectFlags",
    label: "Known network effect flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerNetworkEffectClassIds,
    input.callerNetworkEffectRequirements,
    input.observedNetworkEffectEvidence,
    input.knownNetworkEffectFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerNetworkEffectClassIds: ["a", "b"],
  callerNetworkEffectRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedNetworkEffectEvidence: [1, 0],
  knownNetworkEffectFlags: [1, 0],
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
  id: "entrepreneurship/network-effects-direct-indirect-taxonomy-classifier",
  title: "Network Effects Direct Indirect Taxonomy Classifier",
  description:
    "Independently evidenced same-side/cross-side interaction criteria for direct/indirect network-effect candidates, no growth implies causal network benefit. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerNetworkEffectClassIds:
        value.callerNetworkEffectClassIds as readonly string[],
      callerNetworkEffectRequirements:
        value.callerNetworkEffectRequirements as readonly (readonly number[])[],
      observedNetworkEffectEvidence:
        value.observedNetworkEffectEvidence as readonly number[],
      knownNetworkEffectFlags:
        value.knownNetworkEffectFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
