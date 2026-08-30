import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DominantHeightInput = Readonly<{
  readonly sumDominantHeightsMeters: number;
  readonly dominantTreeCount: number;
}>;
export type DominantHeightOutput = Readonly<{
  readonly dominantHeightMeters: number;
}>;

export const calculateDominantHeight = (
  x: DominantHeightInput,
): DominantHeightOutput => {
  if (
    !Number.isFinite(x.sumDominantHeightsMeters) ||
    x.sumDominantHeightsMeters < 0
  )
    simpleError(
      "sumDominantHeightsMeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.dominantTreeCount) ||
    !Number.isSafeInteger(x.dominantTreeCount) ||
    x.dominantTreeCount < 1
  )
    simpleError("dominantTreeCount", "Provide a positive safe integer.");
  const dominantHeightMeters = x.sumDominantHeightsMeters / x.dominantTreeCount;
  if (!Number.isFinite(dominantHeightMeters))
    simpleError(
      "dominantHeightMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dominantHeightMeters: Object.is(dominantHeightMeters, -0)
      ? 0
      : dominantHeightMeters,
  };
};

export const example = {
  input: {
    sumDominantHeightsMeters: 100,
    dominantTreeCount: 5,
  },
  output: { dominantHeightMeters: 20 },
} satisfies ToolExample<DominantHeightInput, DominantHeightOutput>;

export const tool = createSimpleTool({
  id: "forestry/dominant-height",
  title: "Dominant Height",
  description:
    "Mean height of a selected dominant-tree sample from summed heights and sample tree count.",
  inputs: [
    {
      id: "sumDominantHeightsMeters",
      kind: "number",
      label: "Sum Dominant Heights Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "dominantTreeCount",
      kind: "integer",
      label: "Dominant Tree Count",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "dominantHeightMeters",
      kind: "number",
      label: "Dominant Height Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateDominantHeight({
      sumDominantHeightsMeters: input.sumDominantHeightsMeters as number,
      dominantTreeCount: input.dominantTreeCount as number,
    }),
});
export const dominantHeightTool = tool;
export const runDominantHeight = tool.execute;
export default tool;
