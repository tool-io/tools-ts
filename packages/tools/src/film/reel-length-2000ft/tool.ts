import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReelLength2000ftInput = Readonly<{
  readonly reelFillFraction: number;
}>;
export type ReelLength2000ftOutput = Readonly<{
  readonly lengthMeters: number;
}>;

export const calculateReelLength2000ft = (
  x: ReelLength2000ftInput,
): ReelLength2000ftOutput => {
  if (!Number.isFinite(x.reelFillFraction) || x.reelFillFraction < 0)
    simpleError("reelFillFraction", "Provide a finite number at least 0.");
  if (x.reelFillFraction > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const lengthMeters = 2000 * 0.3048 * x.reelFillFraction;
  if (!Number.isFinite(lengthMeters))
    simpleError(
      "lengthMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lengthMeters: Object.is(lengthMeters, -0) ? 0 : lengthMeters };
};

export const example = {
  input: { reelFillFraction: 1 },
  output: { lengthMeters: 609.6 },
} satisfies ToolExample<ReelLength2000ftInput, ReelLength2000ftOutput>;

export const tool = createSimpleTool({
  id: "film/reel-length-2000ft",
  title: "Reel Length 2000 ft",
  description:
    "Metric length of film loaded onto a nominal 2,000-foot reel at the supplied fill fraction; full reel is 609.6 m.",
  inputs: [
    {
      id: "reelFillFraction",
      kind: "number",
      label: "Reel Fill Fraction",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lengthMeters", kind: "number", label: "Length Meters", unit: "m" },
  ],
  calculate: (input) =>
    calculateReelLength2000ft({
      reelFillFraction: input.reelFillFraction as number,
    }),
});
export const reelLength2000ftTool = tool;
export const runReelLength2000ft = tool.execute;
export default tool;
