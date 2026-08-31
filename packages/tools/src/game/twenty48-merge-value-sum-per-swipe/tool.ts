import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, bounded } from "../shared.js";
export type Input = Readonly<{ readonly lineBeforeSwipe: readonly number[] }>;
export type Output = Readonly<{
  readonly lineAfterLeftSwipe: readonly number[];
  readonly mergeScoreAdded: number;
  readonly lineChanged: boolean;
}>;
const inputFields = [
  { id: "lineBeforeSwipe", label: "Line before swipe", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.lineBeforeSwipe.length || input.lineBeforeSwipe.length > 16)
    simpleError("line", "1–16 observed line cells required.");
  input.lineBeforeSwipe.forEach((v) => {
    count(v, "tile");
    if (v !== 0 && (!Number.isInteger(Math.log2(v)) || v > 2 ** 52))
      simpleError(
        "tile",
        "Zero or exactly representable bounded power-of-two tile required.",
      );
  });
  const compact = input.lineBeforeSwipe.filter((v) => v > 0),
    out: number[] = [];
  let score = 0;
  for (let i = 0; i < compact.length; i++) {
    if (compact[i] === compact[i + 1]) {
      const merged = count(compact[i] * 2, "mergedTile");
      score = count(score + merged, "score");
      out.push(merged);
      i++;
    } else out.push(compact[i]);
  }
  while (out.length < input.lineBeforeSwipe.length) out.push(0);
  return {
    lineAfterLeftSwipe: out,
    mergeScoreAdded: score,
    lineChanged: out.some((v, i) => v !== input.lineBeforeSwipe[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { lineBeforeSwipe: [2, 2, 2, 2] } satisfies Input;
export const exampleOutput = {
  lineAfterLeftSwipe: [4, 4, 0, 0],
  mergeScoreAdded: 8,
  lineChanged: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/twenty48-merge-value-sum-per-swipe",
  title: "2048 Merge Value Sum Per Swipe",
  description:
    "Resolve deterministic 2048 left swipe compression and each-tile-at-most-once merging, with score from produced merged values; no random spawn or chain-merging newly created tiles.",
  inputs: inputFields,
  outputs: [
    {
      id: "lineAfterLeftSwipe",
      label: "Line after left swipe",
      kind: "numberList",
    },
    { id: "mergeScoreAdded", label: "Merge score added", kind: "number" },
    { id: "lineChanged", label: "Line changed", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({ lineBeforeSwipe: value.lineBeforeSwipe as readonly number[] }),
});
export const run = tool.execute;
export default tool;
