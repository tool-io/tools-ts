import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedObservedTurnoutDegrees: readonly number[];
  readonly callerObservedTurnoutDegreesLower: readonly number[];
  readonly callerObservedTurnoutDegreesUpper: readonly number[];
  readonly knownObservedTurnoutDegreesFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObservedTurnoutDegrees",
    label: "Observed observed turnout degrees",
    kind: "numberList",
  },
  {
    id: "callerObservedTurnoutDegreesLower",
    label: "Caller observed turnout degrees lower",
    kind: "numberList",
  },
  {
    id: "callerObservedTurnoutDegreesUpper",
    label: "Caller observed turnout degrees upper",
    kind: "numberList",
  },
  {
    id: "knownObservedTurnoutDegreesFlags",
    label: "Known observed turnout degrees flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedObservedTurnoutDegrees,
    input.callerObservedTurnoutDegreesLower,
    input.callerObservedTurnoutDegreesUpper,
    input.knownObservedTurnoutDegreesFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedTurnoutDegrees: [2, 5],
  callerObservedTurnoutDegreesLower: [1, 1],
  callerObservedTurnoutDegreesUpper: [3, 4],
  knownObservedTurnoutDegreesFlags: [1, 0],
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
  id: "dance/turnout-degree-assessment-scale-lookup",
  title: "Turnout Degree Assessment Scale Lookup",
  description:
    "Independently measured protocol-specific turnout vs caller qualified-assessor bands; not imposed ideal rotation or joint injury diagnosis. Missing evidence retained as explicit indices, not confirmed zero margin. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      observedObservedTurnoutDegrees:
        value.observedObservedTurnoutDegrees as readonly number[],
      callerObservedTurnoutDegreesLower:
        value.callerObservedTurnoutDegreesLower as readonly number[],
      callerObservedTurnoutDegreesUpper:
        value.callerObservedTurnoutDegreesUpper as readonly number[],
      knownObservedTurnoutDegreesFlags:
        value.knownObservedTurnoutDegreesFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
