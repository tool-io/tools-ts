import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly forwardStrandPeakBp: number;
  readonly reverseStrandPeakBp: number;
}>;
export type Output = Readonly<{
  readonly fragmentShiftBp: number;
  readonly estimatedFragmentLengthBp: number;
}>;

export const calculate = (input: Input): Output => {
  const fragmentShiftBp = Math.abs(
    input.reverseStrandPeakBp - input.forwardStrandPeakBp,
  );
  return { fragmentShiftBp, estimatedFragmentLengthBp: fragmentShiftBp };
};

export const exampleInput = {
  forwardStrandPeakBp: 100,
  reverseStrandPeakBp: 250,
} satisfies Input;
export const exampleOutput = {
  fragmentShiftBp: 150,
  estimatedFragmentLengthBp: 150,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      forwardStrandPeakBp: input.forwardStrandPeakBp as number,
      reverseStrandPeakBp: input.reverseStrandPeakBp as number,
    }),
  description: "Calculate bimodal strand-peak shift distance.",
  id: "epigenetics/fragment-shift-distance",
  inputs: [
    {
      id: "forwardStrandPeakBp",
      label: "Forward-strand peak",
      kind: "number",
      unit: "bp",
    },
    {
      id: "reverseStrandPeakBp",
      label: "Reverse-strand peak",
      kind: "number",
      unit: "bp",
    },
  ],
  outputs: [
    {
      id: "fragmentShiftBp",
      label: "Bimodal shift distance",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
    {
      id: "estimatedFragmentLengthBp",
      label: "Estimated fragment length",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
  ],
  title: "Fragment Shift Distance",
});

export const run = tool.execute;
export default tool;
