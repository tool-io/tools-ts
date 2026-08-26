import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MarinaBerthDepthTideInput = {
  readonly berthDepthMeters: number;
  readonly heightOfTideMeters: number;
  readonly vesselDraftMeters: number;
};

export type MarinaBerthDepthTideOutput = {
  readonly availableDepthMeters: number;
  readonly sufficient: boolean;
};

export const marinaBerthDepthTideExample = {
  input: {
    berthDepthMeters: 2,
    heightOfTideMeters: 0.5,
    vesselDraftMeters: 2.5,
  },
  output: { availableDepthMeters: 2.5, sufficient: true },
} satisfies ToolExample<MarinaBerthDepthTideInput, MarinaBerthDepthTideOutput>;

export const calculateMarinaBerthDepthTide = (
  input: MarinaBerthDepthTideInput,
): MarinaBerthDepthTideOutput => {
  if (input.berthDepthMeters <= 0)
    simpleError(
      "berthDepthMeters",
      "Berth depth must be positive.",
      "invalid_input",
    );
  if (input.vesselDraftMeters <= 0)
    simpleError(
      "vesselDraftMeters",
      "Vessel draft must be positive.",
      "invalid_input",
    );
  const availableDepthMeters =
    input.berthDepthMeters + input.heightOfTideMeters;
  return {
    availableDepthMeters,
    sufficient: availableDepthMeters >= input.vesselDraftMeters,
  };
};

export const marinaBerthDepthTideTool = createSimpleTool({
  calculate: (input) =>
    calculateMarinaBerthDepthTide(
      input as unknown as MarinaBerthDepthTideInput,
    ),
  description:
    "Check whether a marina berth holds enough water by adding the height of tide to the charted berth depth and comparing against the vessel draft.",
  id: "sailing/marina-berth-depth-tide",
  inputs: [
    {
      description: "Charted depth of the berth below chart datum.",
      format: "length-m",
      id: "berthDepthMeters",
      kind: "number",
      label: "Berth depth",
      unit: "m",
    },
    {
      description:
        "Signed height of tide above chart datum; negative values indicate a tide below datum.",
      format: "length-m",
      id: "heightOfTideMeters",
      kind: "number",
      label: "Height of tide",
      unit: "m",
    },
    {
      description: "Maximum draft of the vessel.",
      format: "length-m",
      id: "vesselDraftMeters",
      kind: "number",
      label: "Vessel draft",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Total water available in the berth at the given tide.",
      format: "length-m",
      id: "availableDepthMeters",
      kind: "number",
      label: "Available depth",
      unit: "m",
    },
    {
      description:
        "True when the available depth equals or exceeds the vessel draft.",
      id: "sufficient",
      kind: "boolean",
      label: "Sufficient",
    },
  ],
  title: "Berth Depth Check",
});
export const runMarinaBerthDepthTide = marinaBerthDepthTideTool.execute;
export default marinaBerthDepthTideTool;
