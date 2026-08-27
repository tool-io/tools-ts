import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlickerNoiseCornerInput = {
  readonly flickerUvAt1Hz: number;
  readonly whiteNoiseUvPerRootHz: number;
};

export type FlickerNoiseCornerOutput = {
  readonly cornerFrequencyHz: number;
};

export const flickerNoiseCornerExample = {
  input: { flickerUvAt1Hz: 4, whiteNoiseUvPerRootHz: 2 },
  output: { cornerFrequencyHz: 4 },
} satisfies ToolExample<FlickerNoiseCornerInput, FlickerNoiseCornerOutput>;

export const calculateFlickerNoiseCorner = (
  input: FlickerNoiseCornerInput,
): FlickerNoiseCornerOutput => {
  if (!(input.flickerUvAt1Hz > 0))
    simpleError(
      "flickerUvAt1Hz",
      "Flicker density at 1 Hz must be positive.",
      "invalid_density",
    );
  if (!(input.whiteNoiseUvPerRootHz > 0))
    simpleError(
      "whiteNoiseUvPerRootHz",
      "White noise density must be positive.",
      "invalid_density",
    );
  return {
    cornerFrequencyHz: Math.pow(
      input.flickerUvAt1Hz / input.whiteNoiseUvPerRootHz,
      2,
    ),
  };
};

export const flickerNoiseCornerTool = createSimpleTool({
  calculate: (input) =>
    calculateFlickerNoiseCorner(input as unknown as FlickerNoiseCornerInput),
  description:
    "Compute the flicker noise corner frequency where the 1/f and white noise densities intersect as (flicker density / white density)^2.",
  id: "electronics/flicker-noise-corner",
  inputs: [
    {
      id: "flickerUvAt1Hz",
      kind: "number",
      label: "Flicker density at 1 Hz",
      unit: "µV",
    },
    {
      id: "whiteNoiseUvPerRootHz",
      kind: "number",
      label: "White noise density",
      unit: "µV/√Hz",
    },
  ],
  outputs: [
    {
      id: "cornerFrequencyHz",
      kind: "number",
      label: "Corner frequency",
      unit: "Hz",
    },
  ],
  title: "Flicker Corner Frequency",
});
export const runFlickerNoiseCorner = flickerNoiseCornerTool.execute;
export default flickerNoiseCornerTool;
