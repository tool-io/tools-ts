import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
  range,
} from "../shared.js";
export type Input = Readonly<{
  readonly wordAdvanceWidthsPx: readonly number[];
  readonly wordCharacterCounts: readonly number[];
  readonly spaceAdvancePx: number;
  readonly availableLineWidthPx: number;
  readonly callerCplBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly greedyLineCharacterCounts: readonly number[];
  readonly greedyLineAdvanceWidthsPx: readonly number[];
  readonly overwideUnbrokenWordIndices: readonly number[];
  readonly linesOutsideCallerCplIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "wordAdvanceWidthsPx",
    label: "Word advance widths px",
    kind: "numberList",
  },
  {
    id: "wordCharacterCounts",
    label: "Word character counts",
    kind: "numberList",
  },
  { id: "spaceAdvancePx", label: "Space advance px", kind: "number" },
  {
    id: "availableLineWidthPx",
    label: "Available line width px",
    kind: "number",
  },
  { id: "callerCplBounds", label: "Caller cpl bounds", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.availableLineWidthPx, "availableLineWidthPx");
  input.wordAdvanceWidthsPx.forEach((v) =>
    nonnegative(v, "wordAdvanceWidthsPx"),
  );
  nonnegative(input.spaceAdvancePx, "spaceAdvancePx");
  input.wordCharacterCounts.forEach((v) => count(v, "wordCharacterCounts"));
  aligned(
    input.wordAdvanceWidthsPx,
    input.wordCharacterCounts,
    "wordAdvanceWidthsPx",
  );
  range(input.callerCplBounds, "cpl");
  input.callerCplBounds.forEach((v) => count(v, "cpl"));
  const chars: number[] = [],
    widths: number[] = [],
    over: number[] = [];
  let w = 0,
    c = 0;
  input.wordAdvanceWidthsPx.forEach((v, i) => {
    if (input.wordCharacterCounts[i] < 1)
      simpleError("characters", "Positive character count per word required.");
    const next = w + (c ? input.spaceAdvancePx : 0) + v;
    if (c && next > input.availableLineWidthPx) {
      chars.push(c);
      widths.push(w);
      w = 0;
      c = 0;
    }
    if (v > input.availableLineWidthPx) over.push(i);
    w += (c ? input.spaceAdvancePx : 0) + v;
    c = count(c + (c ? 1 : 0) + input.wordCharacterCounts[i], "characters");
  });
  chars.push(c);
  widths.push(w);
  return {
    greedyLineCharacterCounts: chars,
    greedyLineAdvanceWidthsPx: widths,
    overwideUnbrokenWordIndices: over,
    linesOutsideCallerCplIndices: chars.flatMap((v, i) =>
      v < input.callerCplBounds[0] || v > input.callerCplBounds[1] ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wordAdvanceWidthsPx: [20, 30, 25],
  wordCharacterCounts: [4, 5, 5],
  spaceAdvancePx: 5,
  availableLineWidthPx: 60,
  callerCplBounds: [5, 12],
} satisfies Input;
export const exampleOutput = {
  greedyLineCharacterCounts: [10, 5],
  greedyLineAdvanceWidthsPx: [55, 25],
  overwideUnbrokenWordIndices: [],
  linesOutsideCallerCplIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/optimal-measure-characters-per-line",
  title: "Optimal Measure Characters-Per-Line",
  description:
    "Greedy whitespace-only wrapping from caller measured word advances/character counts to audit actual CPL and unbreakable-word overflow; no shaping/hyphenation/bidi engine or universal optimal measure.",
  inputs: inputFields,
  outputs: [
    {
      id: "greedyLineCharacterCounts",
      label: "Greedy line character counts",
      kind: "numberList",
    },
    {
      id: "greedyLineAdvanceWidthsPx",
      label: "Greedy line advance widths px",
      kind: "numberList",
    },
    {
      id: "overwideUnbrokenWordIndices",
      label: "Overwide unbroken word indices",
      kind: "numberList",
    },
    {
      id: "linesOutsideCallerCplIndices",
      label: "Lines outside caller cpl indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      wordAdvanceWidthsPx: value.wordAdvanceWidthsPx as readonly number[],
      wordCharacterCounts: value.wordCharacterCounts as readonly number[],
      spaceAdvancePx: value.spaceAdvancePx as number,
      availableLineWidthPx: value.availableLineWidthPx as number,
      callerCplBounds: value.callerCplBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
