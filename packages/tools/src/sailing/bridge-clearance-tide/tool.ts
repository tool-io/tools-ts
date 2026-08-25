import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BridgeClearanceTideInput = {
  readonly bridgeAirDraftMeters: number;
  readonly heightOfTideMeters: number;
  readonly vesselAirDraftMeters: number;
};

export type BridgeClearanceTideOutput = {
  readonly clearanceMeters: number;
};

export const bridgeClearanceTideExample = {
  input: {
    bridgeAirDraftMeters: 25,
    heightOfTideMeters: 1.5,
    vesselAirDraftMeters: 18,
  },
  output: { clearanceMeters: 5.5 },
} satisfies ToolExample<BridgeClearanceTideInput, BridgeClearanceTideOutput>;

export const calculateBridgeClearanceTide = (
  input: BridgeClearanceTideInput,
): BridgeClearanceTideOutput => {
  if (input.bridgeAirDraftMeters <= 0)
    simpleError(
      "bridgeAirDraftMeters",
      "Bridge air draft must be positive.",
      "invalid_input",
    );
  if (input.vesselAirDraftMeters <= 0)
    simpleError(
      "vesselAirDraftMeters",
      "Vessel air draft must be positive.",
      "invalid_input",
    );
  const clearanceMeters =
    input.bridgeAirDraftMeters -
    (input.vesselAirDraftMeters + input.heightOfTideMeters);
  if (clearanceMeters < 0)
    simpleError(
      "",
      "Vessel air draft plus height of tide exceeds the bridge air draft.",
      "insufficient_clearance",
    );
  return { clearanceMeters };
};

export const bridgeClearanceTideTool = createSimpleTool({
  calculate: (input) =>
    calculateBridgeClearanceTide(input as unknown as BridgeClearanceTideInput),
  description:
    "Compute the vertical margin under a chart-datum bridge clearance by subtracting both height of tide and vessel air draft.",
  id: "sailing/bridge-clearance-tide",
  inputs: [
    {
      description:
        "Vertical distance from the water to the lowest bridge span.",
      format: "length-m",
      id: "bridgeAirDraftMeters",
      kind: "number",
      label: "Bridge air draft",
      unit: "m",
    },
    {
      description:
        "Signed height of tide above chart datum; negative values indicate a falling tide below datum.",
      format: "length-m",
      id: "heightOfTideMeters",
      kind: "number",
      label: "Height of tide",
      unit: "m",
    },
    {
      description: "Highest fixed point of the vessel above the waterline.",
      format: "length-m",
      id: "vesselAirDraftMeters",
      kind: "number",
      label: "Vessel air draft",
      unit: "m",
    },
  ],
  outputs: [
    {
      description:
        "Margin remaining between the masthead and the bridge; zero means a touch fit.",
      format: "length-m",
      id: "clearanceMeters",
      kind: "number",
      label: "Clearance",
      unit: "m",
    },
  ],
  title: "Bridge Clearance Calculator",
});
export const runBridgeClearanceTide = bridgeClearanceTideTool.execute;
export default bridgeClearanceTideTool;
