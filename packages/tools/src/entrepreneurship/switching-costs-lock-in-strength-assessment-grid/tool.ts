import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedObservedSwitchingCostComponents: readonly number[];
  readonly callerObservedSwitchingCostComponentsLower: readonly number[];
  readonly callerObservedSwitchingCostComponentsUpper: readonly number[];
  readonly knownObservedSwitchingCostComponentsFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObservedSwitchingCostComponents",
    label: "Observed observed switching cost components",
    kind: "numberList",
  },
  {
    id: "callerObservedSwitchingCostComponentsLower",
    label: "Caller observed switching cost components lower",
    kind: "numberList",
  },
  {
    id: "callerObservedSwitchingCostComponentsUpper",
    label: "Caller observed switching cost components upper",
    kind: "numberList",
  },
  {
    id: "knownObservedSwitchingCostComponentsFlags",
    label: "Known observed switching cost components flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedObservedSwitchingCostComponents,
    input.callerObservedSwitchingCostComponentsLower,
    input.callerObservedSwitchingCostComponentsUpper,
    input.knownObservedSwitchingCostComponentsFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedSwitchingCostComponents: [2, 5],
  callerObservedSwitchingCostComponentsLower: [1, 1],
  callerObservedSwitchingCostComponentsUpper: [3, 4],
  knownObservedSwitchingCostComponentsFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownMargins: [1, 0],
  knownReviewIndices: [],
  unknownIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/switching-costs-lock-in-strength-assessment-grid",
  title: "Switching Costs Lock in Strength Assessment Grid",
  description:
    "Caller independently measured monetary/time/data-portability switching-cost components against explicit bands, not causal customer lock-in or moat certification. Unknown indices distinguish zero placeholders from known zero margins. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKnownMargins",
      label: "Signed known margins",
      kind: "numberList",
    },
    {
      id: "knownReviewIndices",
      label: "Known review indices",
      kind: "numberList",
    },
    { id: "unknownIndices", label: "Unknown indices", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      observedObservedSwitchingCostComponents:
        value.observedObservedSwitchingCostComponents as readonly number[],
      callerObservedSwitchingCostComponentsLower:
        value.callerObservedSwitchingCostComponentsLower as readonly number[],
      callerObservedSwitchingCostComponentsUpper:
        value.callerObservedSwitchingCostComponentsUpper as readonly number[],
      knownObservedSwitchingCostComponentsFlags:
        value.knownObservedSwitchingCostComponentsFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
