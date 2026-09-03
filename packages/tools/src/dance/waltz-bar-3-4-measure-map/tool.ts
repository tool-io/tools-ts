import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerWaltzBeatOrdinals: readonly number[];
}>;
export type Output = Readonly<{
  readonly zeroBasedBarIndices: readonly number[];
  readonly oneBasedBeatWithinThreeBeatBars: readonly number[];
}>;
const inputFields = [
  {
    id: "callerWaltzBeatOrdinals",
    label: "Caller waltz beat ordinals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerWaltzBeatOrdinals.forEach((v) => bounded(v, "beat", 0, 1000000));
  return {
    zeroBasedBarIndices: input.callerWaltzBeatOrdinals.map((v) =>
      Math.floor(v / 3),
    ),
    oneBasedBeatWithinThreeBeatBars: input.callerWaltzBeatOrdinals.map(
      (v) => (v % 3) + 1,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWaltzBeatOrdinals: [0, 1, 2, 3, 4, 5],
} satisfies Input;
export const exampleOutput = {
  zeroBasedBarIndices: [0, 0, 0, 1, 1, 1],
  oneBasedBeatWithinThreeBeatBars: [1, 2, 3, 1, 2, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/waltz-bar-3-4-measure-map",
  title: "Waltz Bar 3/4 Measure Map",
  description:
    "Map explicitly zero-based notated quarter-beat ordinals into 3/4 bars; not imply every dance count is a quarter beat or audio downbeat detection. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "zeroBasedBarIndices",
      label: "Zero based bar indices",
      kind: "numberList",
    },
    {
      id: "oneBasedBeatWithinThreeBeatBars",
      label: "One based beat within three beat bars",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerWaltzBeatOrdinals:
        value.callerWaltzBeatOrdinals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
