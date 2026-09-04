import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerFundingModelClassIds: readonly string[];
  readonly callerFundingModelRequirements: readonly (readonly number[])[];
  readonly observedFundingModelEvidence: readonly number[];
  readonly knownFundingModelFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerFundingModelClassIds",
    label: "Caller funding model class ids",
    kind: "stringList",
  },
  {
    id: "callerFundingModelRequirements",
    label: "Caller funding model requirements",
    kind: "matrix",
  },
  {
    id: "observedFundingModelEvidence",
    label: "Observed funding model evidence",
    kind: "numberList",
  },
  {
    id: "knownFundingModelFlags",
    label: "Known funding model flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerFundingModelClassIds,
    input.callerFundingModelRequirements,
    input.observedFundingModelEvidence,
    input.knownFundingModelFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFundingModelClassIds: ["a", "b"],
  callerFundingModelRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedFundingModelEvidence: [1, 0],
  knownFundingModelFlags: [1, 0],
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
  id: "entrepreneurship/lifestyle-business-vs-vc-scale-fundability-classifier",
  title: "Lifestyle Business vs Vc Scale Fundability Classifier",
  description:
    "Caller independently documented funding/governance/growth criteria for lifestyle/VC model candidates, not fundability verdict. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerFundingModelClassIds:
        value.callerFundingModelClassIds as readonly string[],
      callerFundingModelRequirements:
        value.callerFundingModelRequirements as readonly (readonly number[])[],
      observedFundingModelEvidence:
        value.observedFundingModelEvidence as readonly number[],
      knownFundingModelFlags: value.knownFundingModelFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
