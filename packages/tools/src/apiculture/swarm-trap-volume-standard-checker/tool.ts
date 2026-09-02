import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedMeasuredSwarmTrapLiters: readonly number[];
  readonly callerMeasuredSwarmTrapLitersLower: readonly number[];
  readonly callerMeasuredSwarmTrapLitersUpper: readonly number[];
  readonly knownMeasuredSwarmTrapLitersFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMeasuredSwarmTrapLiters",
    label: "Observed measured swarm trap liters",
    kind: "numberList",
  },
  {
    id: "callerMeasuredSwarmTrapLitersLower",
    label: "Caller measured swarm trap liters lower",
    kind: "numberList",
  },
  {
    id: "callerMeasuredSwarmTrapLitersUpper",
    label: "Caller measured swarm trap liters upper",
    kind: "numberList",
  },
  {
    id: "knownMeasuredSwarmTrapLitersFlags",
    label: "Known measured swarm trap liters flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedMeasuredSwarmTrapLiters,
    input.callerMeasuredSwarmTrapLitersLower,
    input.callerMeasuredSwarmTrapLitersUpper,
    input.knownMeasuredSwarmTrapLitersFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMeasuredSwarmTrapLiters: [2, 5],
  callerMeasuredSwarmTrapLitersLower: [1, 1],
  callerMeasuredSwarmTrapLitersUpper: [3, 4],
  knownMeasuredSwarmTrapLitersFlags: [1, 0],
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
  id: "apiculture/swarm-trap-volume-standard-checker",
  title: "Swarm Trap Volume Standard Checker",
  description:
    "Measured swarm trap usable volume against independently verified caller site/management band, not universal biological trap optimum. Unknown indices distinguish zero placeholders from known zero margins. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      observedMeasuredSwarmTrapLiters:
        value.observedMeasuredSwarmTrapLiters as readonly number[],
      callerMeasuredSwarmTrapLitersLower:
        value.callerMeasuredSwarmTrapLitersLower as readonly number[],
      callerMeasuredSwarmTrapLitersUpper:
        value.callerMeasuredSwarmTrapLitersUpper as readonly number[],
      knownMeasuredSwarmTrapLitersFlags:
        value.knownMeasuredSwarmTrapLitersFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
