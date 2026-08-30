import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly startsBp: readonly number[];
  readonly endsBp: readonly number[];
  readonly maximumGapBp: number;
}>;
export type Output = Readonly<{
  readonly mergedStartsBp: readonly number[];
  readonly mergedEndsBp: readonly number[];
  readonly regionCount: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.startsBp.length;
  if (
    n === 0 ||
    n !== input.endsBp.length ||
    input.maximumGapBp < 0 ||
    input.startsBp.some(
      (v, i) => v > input.endsBp[i] || (i > 0 && v < input.startsBp[i - 1]),
    )
  )
    simpleError("startsBp", "Aligned sorted intervals are required.");
  const mergedStartsBp: number[] = [],
    mergedEndsBp: number[] = [];
  for (let i = 0; i < n; i++) {
    const last = mergedEndsBp.length - 1;
    if (
      last >= 0 &&
      input.startsBp[i] - mergedEndsBp[last] <= input.maximumGapBp
    )
      mergedEndsBp[last] = Math.max(mergedEndsBp[last], input.endsBp[i]);
    else {
      mergedStartsBp.push(input.startsBp[i]);
      mergedEndsBp.push(input.endsBp[i]);
    }
  }
  return { mergedStartsBp, mergedEndsBp, regionCount: mergedStartsBp.length };
};

export const exampleInput = {
  startsBp: [10, 25, 100],
  endsBp: [20, 30, 110],
  maximumGapBp: 10,
} satisfies Input;
export const exampleOutput = {
  mergedStartsBp: [10, 100],
  mergedEndsBp: [30, 110],
  regionCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/dmr-window-merger",
  title: "DMR Window Merger",
  description: "Merge adjacent DMR windows within a selected distance.",
  inputs: [
    { id: "startsBp", kind: "numberList", label: "Starts bp" },
    { id: "endsBp", kind: "numberList", label: "Ends bp" },
    { id: "maximumGapBp", kind: "number", label: "Maximum gap bp" },
  ],
  outputs: [
    { id: "mergedStartsBp", kind: "numberList", label: "Merged starts bp" },
    { id: "mergedEndsBp", kind: "numberList", label: "Merged ends bp" },
    { id: "regionCount", kind: "number", label: "Region count" },
  ],
  calculate: (value) =>
    calculate({
      startsBp: value.startsBp as readonly number[],
      endsBp: value.endsBp as readonly number[],
      maximumGapBp: value.maximumGapBp as number,
    }),
});
export const run = tool.execute;
export default tool;
