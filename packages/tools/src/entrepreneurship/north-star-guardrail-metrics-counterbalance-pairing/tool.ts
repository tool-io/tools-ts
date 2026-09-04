import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedNorthStarChange: number;
  readonly callerDesiredNorthStarMinimum: number;
  readonly observedGuardrailChanges: readonly number[];
  readonly callerGuardrailLowerBounds: readonly number[];
  readonly callerGuardrailUpperBounds: readonly number[];
  readonly knownGuardrailFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly northStarTargetReached: boolean;
  readonly knownGuardrailViolationIndices: readonly number[];
  readonly unknownGuardrailIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedNorthStarChange",
    label: "Observed north star change",
    kind: "number",
  },
  {
    id: "callerDesiredNorthStarMinimum",
    label: "Caller desired north star minimum",
    kind: "number",
  },
  {
    id: "observedGuardrailChanges",
    label: "Observed guardrail changes",
    kind: "numberList",
  },
  {
    id: "callerGuardrailLowerBounds",
    label: "Caller guardrail lower bounds",
    kind: "numberList",
  },
  {
    id: "callerGuardrailUpperBounds",
    label: "Caller guardrail upper bounds",
    kind: "numberList",
  },
  {
    id: "knownGuardrailFlags",
    label: "Known guardrail flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const g = observedBands(
    input.observedGuardrailChanges,
    input.callerGuardrailLowerBounds,
    input.callerGuardrailUpperBounds,
    input.knownGuardrailFlags,
  );
  return {
    northStarTargetReached:
      input.observedNorthStarChange >= input.callerDesiredNorthStarMinimum,
    knownGuardrailViolationIndices: g.knownReviewIndices,
    unknownGuardrailIndices: g.unknownIndices,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNorthStarChange: 10,
  callerDesiredNorthStarMinimum: 0,
  observedGuardrailChanges: [-1, 5],
  callerGuardrailLowerBounds: [-2, 0],
  callerGuardrailUpperBounds: [2, 3],
  knownGuardrailFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  northStarTargetReached: true,
  knownGuardrailViolationIndices: [],
  unknownGuardrailIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/north-star-guardrail-metrics-counterbalance-pairing",
  title: "North Star Guardrail Metrics Counterbalance Pairing",
  description:
    "Pair actual NorthStarchange with caller counterbalancing guardrail bands and unknown evidence; improvement does not override independently breached/unobserved constraints. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "northStarTargetReached",
      label: "North star target reached",
      kind: "boolean",
    },
    {
      id: "knownGuardrailViolationIndices",
      label: "Known guardrail violation indices",
      kind: "numberList",
    },
    {
      id: "unknownGuardrailIndices",
      label: "Unknown guardrail indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNorthStarChange: value.observedNorthStarChange as number,
      callerDesiredNorthStarMinimum:
        value.callerDesiredNorthStarMinimum as number,
      observedGuardrailChanges:
        value.observedGuardrailChanges as readonly number[],
      callerGuardrailLowerBounds:
        value.callerGuardrailLowerBounds as readonly number[],
      callerGuardrailUpperBounds:
        value.callerGuardrailUpperBounds as readonly number[],
      knownGuardrailFlags: value.knownGuardrailFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
