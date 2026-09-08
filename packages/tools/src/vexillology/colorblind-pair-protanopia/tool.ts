import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch43-shared.js";
import { calculate as simulateColor } from "../../color/protanopia-simulation-matrix/tool.js";
export type Input = Readonly<{
  readonly firstSrgb: readonly number[];
  readonly secondSrgb: readonly number[];
  readonly callerModelSpaceMinimumSeparation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstSrgb", label: "First srgb", kind: "numberList" },
  { id: "secondSrgb", label: "Second srgb", kind: "numberList" },
  {
    id: "callerModelSpaceMinimumSeparation",
    label: "Caller model space minimum separation",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerModelSpaceMinimumSeparation, "threshold");
  const a = simulateColor({ baseRgb: input.firstSrgb }),
    b = simulateColor({ baseRgb: input.secondSrgb }),
    d = Math.hypot(...a.simulatedRgb.map((v, i) => v - b.simulatedRgb[i]));
  return {
    simulatedEncodedSrgbDistance: d,
    meetsCallerModelThreshold: d >= input.callerModelSpaceMinimumSeparation,
    firstClippedChannelIndices: [...a.clippedLinearChannelIndices],
    secondClippedChannelIndices: [...b.clippedLinearChannelIndices],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    firstSrgb: [0, 0, 0],
    secondSrgb: [1, 1, 1],
    callerModelSpaceMinimumSeparation: 0.5,
  },
  output: {
    result: {
      simulatedEncodedSrgbDistance: 1.7320508075688772,
      meetsCallerModelThreshold: true,
      firstClippedChannelIndices: [],
      secondClippedChannelIndices: [0],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/colorblind-pair-protanopia",
  title: "Colorblind Safe Pair Checker (protanopia)",
  description:
    "Compose existing Machado 2009 full-severity protanopiasimulation for both actual sRGBcolours, then screen an explicit caller encoded-space separation threshold. Euclidean distance is not perceptual uniformity, colourblind safety, legibility or accessibility certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
