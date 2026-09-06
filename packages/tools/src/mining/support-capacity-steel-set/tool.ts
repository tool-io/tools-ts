import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, demand } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSteelSetLoadsKn: readonly number[];
  readonly callerVerifiedMatchedSteelSetCapacitiesKn: readonly number[];
  readonly knownSteelSetCapacityFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedMargins: readonly number[];
  readonly knownDeficitIndices: readonly number[];
  readonly unknownCapacityIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSteelSetLoadsKn",
    label: "Observed steel set loads kn",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMatchedSteelSetCapacitiesKn",
    label: "Caller verified matched steel set capacities kn",
    kind: "numberList",
  },
  {
    id: "knownSteelSetCapacityFlags",
    label: "Known steel set capacity flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return demand(
    input.observedSteelSetLoadsKn,
    input.callerVerifiedMatchedSteelSetCapacitiesKn,
    input.knownSteelSetCapacityFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSteelSetLoadsKn: [10, 20],
  callerVerifiedMatchedSteelSetCapacitiesKn: [15, 15],
  knownSteelSetCapacityFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedMargins: [5, 0],
  knownDeficitIndices: [],
  unknownCapacityIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/support-capacity-steel-set",
  title: "Steel Set Support Capacity Calculator",
  description:
    "Audit actual steel-set load inventory versus independently certified same-installation capacities, unavailable capacities separate; no generic material-based design or support safety certification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "signedMargins", label: "Signed margins", kind: "numberList" },
    {
      id: "knownDeficitIndices",
      label: "Known deficit indices",
      kind: "numberList",
    },
    {
      id: "unknownCapacityIndices",
      label: "Unknown capacity indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSteelSetLoadsKn:
        value.observedSteelSetLoadsKn as readonly number[],
      callerVerifiedMatchedSteelSetCapacitiesKn:
        value.callerVerifiedMatchedSteelSetCapacitiesKn as readonly number[],
      knownSteelSetCapacityFlags:
        value.knownSteelSetCapacityFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
