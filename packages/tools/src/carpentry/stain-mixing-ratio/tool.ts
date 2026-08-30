import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StainMixingRatioInput = Readonly<{
  readonly totalMilliliters: number;
  readonly concentrateParts: number;
  readonly thinnerParts: number;
}>;
export type StainMixingRatioOutput = Readonly<{
  readonly concentrateMilliliters: number;
  readonly thinnerMilliliters: number;
}>;

export const calculateStainMixingRatio = (
  x: StainMixingRatioInput,
): StainMixingRatioOutput => {
  if (!Number.isFinite(x.totalMilliliters) || x.totalMilliliters < 0)
    simpleError("totalMilliliters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.concentrateParts) || x.concentrateParts < 0)
    simpleError("concentrateParts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.thinnerParts) || x.thinnerParts < 0)
    simpleError("thinnerParts", "Provide a finite number at least 0.");
  if (x.concentrateParts + x.thinnerParts === 0)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const concentrateMilliliters =
    (x.totalMilliliters * x.concentrateParts) /
    (x.concentrateParts + x.thinnerParts);
  if (!Number.isFinite(concentrateMilliliters))
    simpleError(
      "concentrateMilliliters",
      "Inputs produce an undefined or non-finite result.",
    );
  const thinnerMilliliters =
    (x.totalMilliliters * x.thinnerParts) /
    (x.concentrateParts + x.thinnerParts);
  if (!Number.isFinite(thinnerMilliliters))
    simpleError(
      "thinnerMilliliters",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    concentrateMilliliters: Object.is(concentrateMilliliters, -0)
      ? 0
      : concentrateMilliliters,
    thinnerMilliliters: Object.is(thinnerMilliliters, -0)
      ? 0
      : thinnerMilliliters,
  };
};

export const example = {
  input: { totalMilliliters: 1000, concentrateParts: 1, thinnerParts: 3 },
  output: { concentrateMilliliters: 250, thinnerMilliliters: 750 },
} satisfies ToolExample<StainMixingRatioInput, StainMixingRatioOutput>;

export const tool = createSimpleTool({
  id: "carpentry/stain-mixing-ratio",
  title: "Stain Mixing Ratio",
  description:
    "Volumes of stain concentrate and thinner needed for a target mixed volume at a supplied concentrate-to-thinner parts ratio.",
  inputs: [
    {
      id: "totalMilliliters",
      kind: "number",
      label: "Total Milliliters",
      unit: "mL",
      minimum: 0,
    },
    {
      id: "concentrateParts",
      kind: "number",
      label: "Concentrate Parts",
      minimum: 0,
    },
    { id: "thinnerParts", kind: "number", label: "Thinner Parts", minimum: 0 },
  ],
  outputs: [
    {
      id: "concentrateMilliliters",
      kind: "number",
      label: "Concentrate Milliliters",
      unit: "mL",
    },
    {
      id: "thinnerMilliliters",
      kind: "number",
      label: "Thinner Milliliters",
      unit: "mL",
    },
  ],
  calculate: (input) =>
    calculateStainMixingRatio({
      totalMilliliters: input.totalMilliliters as number,
      concentrateParts: input.concentrateParts as number,
      thinnerParts: input.thinnerParts as number,
    }),
});
export const stainMixingRatioTool = tool;
export const runStainMixingRatio = tool.execute;
export default tool;
