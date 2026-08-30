import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PllGainMarginInput = Readonly<{
  readonly gainAtPhaseCrossoverDb: number;
}>;
export type PllGainMarginOutput = Readonly<{
  readonly gainMarginDb: number;
}>;

export const calculatePllGainMargin = (
  x: PllGainMarginInput,
): PllGainMarginOutput => {
  if (!Number.isFinite(x.gainAtPhaseCrossoverDb))
    simpleError("gainAtPhaseCrossoverDb", "Provide a finite number.");
  const gainMarginDb = -x.gainAtPhaseCrossoverDb;
  if (!Number.isFinite(gainMarginDb))
    simpleError("gainMarginDb", "The inputs produce an invalid result.");
  return { gainMarginDb: Object.is(gainMarginDb, -0) ? 0 : gainMarginDb };
};

export const example = {
  input: { gainAtPhaseCrossoverDb: -10 },
  output: { gainMarginDb: 10 },
} satisfies ToolExample<PllGainMarginInput, PllGainMarginOutput>;

export const tool = createSimpleTool({
  id: "electronics/pll-gain-margin",
  title: "PLL Gain Margin",
  description:
    "Calculate loop gain margin from open-loop gain in decibels at the minus-180-degree phase crossover.",
  inputs: [
    {
      id: "gainAtPhaseCrossoverDb",
      kind: "number",
      label: "Loop gain at -180°",
      unit: "dB",
    },
  ],
  outputs: [
    { id: "gainMarginDb", kind: "number", label: "Gain margin", unit: "dB" },
  ],
  calculate: (input) =>
    calculatePllGainMargin({
      gainAtPhaseCrossoverDb: input.gainAtPhaseCrossoverDb as number,
    }),
});
export const pllGainMarginTool = tool;
export const runPllGainMargin = tool.execute;
export default tool;
