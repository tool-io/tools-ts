import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParityProgressionRatioPprInput = {
  readonly womenByParity: readonly number[];
};

export type ParityProgressionRatioPprOutput = {
  readonly progressionRatios: number[];
};

export const calculateParityProgressionRatioPpr = (
  input: ParityProgressionRatioPprInput,
): ParityProgressionRatioPprOutput => {
  const counts = input.womenByParity;
  if (counts.length < 2)
    simpleError(
      "womenByParity",
      "Provide at least two parity groups.",
      "invalid_list",
    );
  for (const value of counts)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "womenByParity",
        "Parity counts must be finite and non-negative.",
        "invalid_list",
      );
  let reached = 0;
  for (const value of counts) reached += value;
  if (!(reached > 0))
    simpleError(
      "womenByParity",
      "The total number of women must be positive.",
      "invalid_list",
    );
  const progressionRatios: number[] = [];
  let progressed = reached - counts[0]!;
  for (let index = 0; index < counts.length - 1; index += 1) {
    if (!(reached > 0))
      simpleError(
        "womenByParity",
        "No women reached one of the parities, so its progression ratio is undefined.",
        "invalid_list",
      );
    progressionRatios.push(progressed / reached);
    reached -= counts[index]!;
    progressed -= counts[index + 1]!;
  }
  return { progressionRatios };
};

export const parityProgressionRatioPprExample = {
  input: { womenByParity: [100, 60, 30, 10] },
  output: { progressionRatios: [0.5, 0.4, 0.25] },
} satisfies ToolExample<
  ParityProgressionRatioPprInput,
  ParityProgressionRatioPprOutput
>;

export const parityProgressionRatioPprTool = createSimpleTool({
  id: "demography/parity-progression-ratio-ppr",
  title: "Parity Progression Ratio PPR Calculator",
  description:
    "Compute Brass parity progression ratios a(i), the share of women who have reached parity i and go on to parity i+1 or higher.",
  inputs: [
    {
      description: "Number of women at each parity, starting with parity zero.",
      id: "womenByParity",
      kind: "numberList",
      label: "Women by parity",
    },
  ],
  outputs: [
    {
      description: "Progression ratio a(i) from each parity i to i+1.",
      id: "progressionRatios",
      kind: "numberList",
      label: "a(i)",
    },
  ],
  calculate: (input) =>
    calculateParityProgressionRatioPpr(
      input as unknown as ParityProgressionRatioPprInput,
    ),
});

export const runParityProgressionRatioPpr =
  parityProgressionRatioPprTool.execute;
export default parityProgressionRatioPprTool;
