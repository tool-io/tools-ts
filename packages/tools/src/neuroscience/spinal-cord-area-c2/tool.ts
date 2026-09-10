import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  bounded,
  positive,
  nonnegative,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyC2SegmentedPixelCountsBySlice: readonly number[];
  readonly verifiedPixelAreaSquareMm: number;
  readonly representedSliceWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyC2SegmentedPixelCountsBySlice",
    label: "Independently c2 segmented pixel counts by slice",
    kind: "numberList",
  },
  {
    id: "verifiedPixelAreaSquareMm",
    label: "Verified pixel area square mm",
    kind: "number",
  },
  {
    id: "representedSliceWeights",
    label: "Represented slice weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyC2SegmentedPixelCountsBySlice,
    input.representedSliceWeights,
    "slices",
  );
  input.independentlyC2SegmentedPixelCountsBySlice.forEach((v) =>
    bounded(v, "pixels", 0, 100000000),
  );
  input.representedSliceWeights.forEach((v) => nonnegative(v, "weight"));
  positive(input.verifiedPixelAreaSquareMm, "pixelarea");
  return {
    observedWeightedC2CrossSectionalAreaSquareMm:
      (input.verifiedPixelAreaSquareMm *
        sum(
          input.independentlyC2SegmentedPixelCountsBySlice.map(
            (v, i) => v * input.representedSliceWeights[i],
          ),
        )) /
      positive(sum(input.representedSliceWeights), "weight"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyC2SegmentedPixelCountsBySlice: [100, 120],
    verifiedPixelAreaSquareMm: 1,
    representedSliceWeights: [1, 1],
  },
  output: { result: { observedWeightedC2CrossSectionalAreaSquareMm: 110 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/spinal-cord-area-c2",
  title: "Spinal Cord Area C2 Calculator",
  description:
    "Actual matched C2cord-mask slice areas pooled by independently represented weights. C2landmark/mask, oblique-plane correction and pixel calibration external, not cord volume or clinical diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
