import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedObservedBattementHeight: readonly number[];
  readonly callerObservedBattementHeightLower: readonly number[];
  readonly callerObservedBattementHeightUpper: readonly number[];
  readonly knownObservedBattementHeightFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObservedBattementHeight",
    label: "Observed observed battement height",
    kind: "numberList",
  },
  {
    id: "callerObservedBattementHeightLower",
    label: "Caller observed battement height lower",
    kind: "numberList",
  },
  {
    id: "callerObservedBattementHeightUpper",
    label: "Caller observed battement height upper",
    kind: "numberList",
  },
  {
    id: "knownObservedBattementHeightFlags",
    label: "Known observed battement height flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedObservedBattementHeight,
    input.callerObservedBattementHeightLower,
    input.callerObservedBattementHeightUpper,
    input.knownObservedBattementHeightFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedBattementHeight: [2, 5],
  callerObservedBattementHeightLower: [1, 1],
  callerObservedBattementHeightUpper: [3, 4],
  knownObservedBattementHeightFlags: [1, 0],
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
  id: "dance/tendu-degage-battement-height-percent-lookup",
  title: "Tendu Degage Battement Height Percent Lookup",
  description:
    "Observed method/performer-specific tendu/degagé/battement height evidence vs independently verified protocol bands, no universal limb-height percent. Missing evidence retained as explicit indices, not confirmed zero margin. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      observedObservedBattementHeight:
        value.observedObservedBattementHeight as readonly number[],
      callerObservedBattementHeightLower:
        value.callerObservedBattementHeightLower as readonly number[],
      callerObservedBattementHeightUpper:
        value.callerObservedBattementHeightUpper as readonly number[],
      knownObservedBattementHeightFlags:
        value.knownObservedBattementHeightFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
