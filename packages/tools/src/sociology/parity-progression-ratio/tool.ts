import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParityProgressionRatioInput = {
  readonly womenAtParity: readonly number[];
};

export type ParityProgressionRatioOutput = {
  readonly progressionRatios: readonly number[];
};

export const parityProgressionRatioExample = {
  input: {
    womenAtParity: [100, 70, 35, 10],
  },
  output: {
    progressionRatios: [0.7, 0.5, 0.2857142857142857],
  },
} satisfies ToolExample<
  ParityProgressionRatioInput,
  ParityProgressionRatioOutput
>;

export const calculateParityProgressionRatios = (
  input: ParityProgressionRatioInput,
): ParityProgressionRatioOutput => {
  if (input.womenAtParity.length < 2)
    simpleError(
      "womenAtParity",
      "At least two cumulative parity counts are required.",
      "invalid_value",
    );
  if (input.womenAtParity.some((count) => !Number.isFinite(count) || count < 0))
    simpleError(
      "womenAtParity",
      "Parity counts must be finite nonnegative numbers.",
      "invalid_value",
    );
  const ratios: number[] = [];
  for (let index = 1; index < input.womenAtParity.length; index += 1) {
    const from = input.womenAtParity[index - 1];
    if (from <= 0)
      simpleError(
        "womenAtParity",
        "Each starting parity count must be positive to progress from it.",
        "invalid_value",
      );
    if (input.womenAtParity[index] > from)
      simpleError(
        "womenAtParity",
        "Cumulative counts must not increase at a higher parity.",
        "invalid_order",
      );
    ratios.push(input.womenAtParity[index] / from);
  }
  return { progressionRatios: ratios };
};

export const parityProgressionRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateParityProgressionRatios({
      womenAtParity: input.womenAtParity as readonly number[],
    }),
  description:
    "Convert counts of women at each birth parity into the parity progression ratios between them.",
  id: "sociology/parity-progression-ratio",
  inputs: [
    {
      description:
        "Women counted at parity zero, one, two, and onward in order.",
      id: "womenAtParity",
      kind: "numberList",
      label: "Women at parity",
    },
  ],
  outputs: [
    {
      description: "Share of women at each parity who go on to the next.",
      id: "progressionRatios",
      kind: "numberList",
      label: "Progression ratios",
    },
  ],
  title: "Parity Progression Ratio Calculator",
});
export const runParityProgressionRatio = parityProgressionRatioTool.execute;
export default parityProgressionRatioTool;
