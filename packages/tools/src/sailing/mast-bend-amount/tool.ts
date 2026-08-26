import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MastBendAmountInput = {
  bendPercent?: number;
  mastHeightMeters: number;
};

export type MastBendAmountOutput = {
  bendMeters: number;
};

const DEFAULT_BEND_PERCENT = 1.5;

export const mastBendAmountExample = {
  input: { mastHeightMeters: 15 },
  output: { bendMeters: 0.225 },
} satisfies ToolExample<MastBendAmountInput, MastBendAmountOutput>;

export const calculateMastBendAmount = (
  input: MastBendAmountInput,
): MastBendAmountOutput => {
  if (input.mastHeightMeters <= 0)
    simpleError(
      "mastHeightMeters",
      "Mast height must be positive.",
      "invalid_input",
    );
  const bendPercent = input.bendPercent ?? DEFAULT_BEND_PERCENT;
  if (!(Number.isFinite(bendPercent) && bendPercent >= 0 && bendPercent <= 5))
    simpleError(
      "bendPercent",
      "Bend percentage must be finite and between zero and five percent.",
      "invalid_percentage",
    );
  return { bendMeters: (input.mastHeightMeters * bendPercent) / 100 };
};

export const mastBendAmountTool = createSimpleTool({
  calculate: (input) =>
    calculateMastBendAmount({
      bendPercent: input.bendPercent as number | undefined,
      mastHeightMeters: input.mastHeightMeters as number,
    }),
  description:
    "Compute mast bend from bendMeters = mastHeightMeters * bendPercent / 100.",
  id: "sailing/mast-bend-amount",
  inputs: [
    {
      description: "Height of the mast above the deck.",
      id: "mastHeightMeters",
      kind: "number",
      label: "Mast height",
      minimum: 0,
      unit: "m",
    },
    {
      default: DEFAULT_BEND_PERCENT,
      description: "Bend as a percentage of mast height, between 0 and 5.",
      id: "bendPercent",
      kind: "number",
      label: "Bend percentage",
      maximum: 5,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Lateral bend at the masthead.",
      format: "length-m",
      id: "bendMeters",
      kind: "number",
      label: "Mast bend",
      unit: "m",
    },
  ],
  title: "Mast Bend Calculator",
});
export const runMastBendAmount = mastBendAmountTool.execute;
export default mastBendAmountTool;
