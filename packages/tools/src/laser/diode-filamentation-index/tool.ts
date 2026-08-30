import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nearFieldIntensities: readonly number[];
  readonly hotspotMultiple: number;
}>;
export type Output = Readonly<{
  readonly meanIntensity: number;
  readonly filamentationIndex: number;
  readonly hotspotCount: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.nearFieldIntensities.length === 0 ||
    input.nearFieldIntensities.some((value) => value < 0)
  )
    simpleError(
      "nearFieldIntensities",
      "Intensities must be nonempty and nonnegative.",
      "invalid_samples",
    );
  const meanIntensity =
    input.nearFieldIntensities.reduce((a, b) => a + b, 0) /
    input.nearFieldIntensities.length;
  if (meanIntensity === 0)
    simpleError(
      "nearFieldIntensities",
      "Mean intensity must be positive.",
      "zero_intensity",
    );
  return {
    meanIntensity,
    filamentationIndex: Math.max(...input.nearFieldIntensities) / meanIntensity,
    hotspotCount: input.nearFieldIntensities.filter(
      (value) => value >= meanIntensity * input.hotspotMultiple,
    ).length,
  };
};

export const exampleInput = {
  nearFieldIntensities: [1, 1, 4],
  hotspotMultiple: 2,
} satisfies Input;
export const exampleOutput = {
  meanIntensity: 2,
  filamentationIndex: 2,
  hotspotCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      nearFieldIntensities: input.nearFieldIntensities as readonly number[],
      hotspotMultiple: input.hotspotMultiple as number,
    }),
  description:
    "Quantify broad-area diode filamentation from near-field intensity samples.",
  id: "laser/diode-filamentation-index",
  inputs: [
    {
      id: "nearFieldIntensities",
      label: "Near-field intensity samples",
      kind: "numberList",
    },
    {
      id: "hotspotMultiple",
      label: "Hotspot threshold multiple",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "meanIntensity",
      label: "Mean intensity",
      kind: "number",
      minimum: 0,
    },
    {
      id: "filamentationIndex",
      label: "Peak-to-mean intensity",
      kind: "number",
      minimum: 0,
    },
    { id: "hotspotCount", label: "Hotspot count", kind: "integer", minimum: 0 },
  ],
  title: "Diode Filamentation Index",
});

export const run = tool.execute;
export default tool;
