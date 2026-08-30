import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WormGearRatioInput = Readonly<{
  readonly wheelTeeth: number;
  readonly wormStarts: number;
}>;
export type WormGearRatioOutput = Readonly<{
  readonly reductionRatio: number;
}>;

export const calculateWormGearRatio = (
  x: WormGearRatioInput,
): WormGearRatioOutput => {
  if (!Number.isFinite(x.wheelTeeth) || x.wheelTeeth < 1)
    simpleError("wheelTeeth", "Provide a positive integer.");
  if (!Number.isFinite(x.wormStarts) || x.wormStarts < 1)
    simpleError("wormStarts", "Provide a positive integer.");
  if (!Number.isInteger(x.wheelTeeth) || !Number.isInteger(x.wormStarts))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const reductionRatio = x.wheelTeeth / x.wormStarts;
  if (!Number.isFinite(reductionRatio))
    simpleError(
      "reductionRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { reductionRatio: Object.is(reductionRatio, -0) ? 0 : reductionRatio };
};

export const example = {
  input: { wheelTeeth: 40, wormStarts: 2 },
  output: { reductionRatio: 20 },
} satisfies ToolExample<WormGearRatioInput, WormGearRatioOutput>;

export const tool = createSimpleTool({
  id: "engineering/worm-gear-ratio",
  title: "Worm Gear Ratio",
  description:
    "Ideal worm gear reduction ratio from wheel tooth count divided by worm starts.",
  inputs: [
    { id: "wheelTeeth", kind: "integer", label: "Wheel Teeth", minimum: 1 },
    { id: "wormStarts", kind: "integer", label: "Worm Starts", minimum: 1 },
  ],
  outputs: [{ id: "reductionRatio", kind: "number", label: "Reduction Ratio" }],
  calculate: (input) =>
    calculateWormGearRatio({
      wheelTeeth: input.wheelTeeth as number,
      wormStarts: input.wormStarts as number,
    }),
});
export const wormGearRatioTool = tool;
export const runWormGearRatio = tool.execute;
export default tool;
