import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EarthworkVolumeAverageEndAreaInput = Readonly<{
  readonly firstAreaSquareMeters: number;
  readonly secondAreaSquareMeters: number;
  readonly spacingMeters: number;
}>;
export type EarthworkVolumeAverageEndAreaOutput = Readonly<{
  readonly volumeCubicMeters: number;
}>;

export const calculateEarthworkVolumeAverageEndArea = (
  x: EarthworkVolumeAverageEndAreaInput,
): EarthworkVolumeAverageEndAreaOutput => {
  if (!Number.isFinite(x.firstAreaSquareMeters) || x.firstAreaSquareMeters < 0)
    simpleError("firstAreaSquareMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.secondAreaSquareMeters) ||
    x.secondAreaSquareMeters < 0
  )
    simpleError(
      "secondAreaSquareMeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.spacingMeters) || x.spacingMeters < 0)
    simpleError("spacingMeters", "Provide a finite number at least 0.");
  const volumeCubicMeters =
    ((x.firstAreaSquareMeters + x.secondAreaSquareMeters) * x.spacingMeters) /
    2;
  if (!Number.isFinite(volumeCubicMeters))
    simpleError(
      "volumeCubicMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    volumeCubicMeters: Object.is(volumeCubicMeters, -0) ? 0 : volumeCubicMeters,
  };
};

export const example = {
  input: {
    firstAreaSquareMeters: 10,
    secondAreaSquareMeters: 20,
    spacingMeters: 5,
  },
  output: { volumeCubicMeters: 75 },
} satisfies ToolExample<
  EarthworkVolumeAverageEndAreaInput,
  EarthworkVolumeAverageEndAreaOutput
>;

export const tool = createSimpleTool({
  id: "engineering/earthwork-volume-average-end-area",
  title: "Earthwork Volume Average End Area",
  description:
    "Earthwork volume between two sections by the average-end-area method; assumes linear area change.",
  inputs: [
    {
      id: "firstAreaSquareMeters",
      kind: "number",
      label: "First Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "secondAreaSquareMeters",
      kind: "number",
      label: "Second Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "spacingMeters",
      kind: "number",
      label: "Spacing Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "volumeCubicMeters",
      kind: "number",
      label: "Volume Cubic Meters",
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateEarthworkVolumeAverageEndArea({
      firstAreaSquareMeters: input.firstAreaSquareMeters as number,
      secondAreaSquareMeters: input.secondAreaSquareMeters as number,
      spacingMeters: input.spacingMeters as number,
    }),
});
export const earthworkVolumeAverageEndAreaTool = tool;
export const runEarthworkVolumeAverageEndArea = tool.execute;
export default tool;
