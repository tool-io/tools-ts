import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly enhancerStartsBp: readonly number[];
  readonly enhancerEndsBp: readonly number[];
  readonly maximumStitchDistanceBp: number;
}>;
export type Output = Readonly<{
  readonly stitchedRegionCount: number;
  readonly stitchedLengthsBp: readonly number[];
  readonly totalStitchedLengthBp: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.enhancerStartsBp.length;
  if (
    n === 0 ||
    input.enhancerEndsBp.length !== n ||
    input.enhancerStartsBp.some(
      (v, i) =>
        v > input.enhancerEndsBp[i] ||
        (i > 0 && v < input.enhancerStartsBp[i - 1]),
    )
  )
    simpleError(
      "enhancerStartsBp",
      "Aligned sorted enhancer intervals are required.",
      "invalid_intervals",
    );
  const lengths: number[] = [];
  let start = input.enhancerStartsBp[0],
    end = input.enhancerEndsBp[0];
  for (let i = 1; i < n; i += 1) {
    if (input.enhancerStartsBp[i] - end <= input.maximumStitchDistanceBp)
      end = Math.max(end, input.enhancerEndsBp[i]);
    else {
      lengths.push(end - start);
      start = input.enhancerStartsBp[i];
      end = input.enhancerEndsBp[i];
    }
  }
  lengths.push(end - start);
  return {
    stitchedRegionCount: lengths.length,
    stitchedLengthsBp: lengths,
    totalStitchedLengthBp: lengths.reduce((a, b) => a + b, 0),
  };
};

export const exampleInput = {
  enhancerStartsBp: [0, 150, 500],
  enhancerEndsBp: [100, 250, 600],
  maximumStitchDistanceBp: 100,
} satisfies Input;
export const exampleOutput = {
  stitchedRegionCount: 2,
  stitchedLengthsBp: [250, 100],
  totalStitchedLengthBp: 350,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      enhancerStartsBp: input.enhancerStartsBp as readonly number[],
      enhancerEndsBp: input.enhancerEndsBp as readonly number[],
      maximumStitchDistanceBp: input.maximumStitchDistanceBp as number,
    }),
  description:
    "Stitch enhancer intervals separated by a supplied maximum distance.",
  id: "epigenetics/super-enhancer-stitching",
  inputs: [
    { id: "enhancerStartsBp", label: "Enhancer starts", kind: "numberList" },
    { id: "enhancerEndsBp", label: "Enhancer ends", kind: "numberList" },
    {
      id: "maximumStitchDistanceBp",
      label: "Maximum stitch distance",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stitchedRegionCount",
      label: "Stitched region count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "stitchedLengthsBp",
      label: "Stitched region lengths",
      kind: "numberList",
      unit: "bp",
    },
    {
      id: "totalStitchedLengthBp",
      label: "Total stitched length",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
  ],
  title: "Super-Enhancer Stitching",
});

export const run = tool.execute;
export default tool;
