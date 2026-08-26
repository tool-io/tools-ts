import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TideGateWindowInput = {
  readonly gateDistanceNm: number;
  readonly boatSpeedKt: number;
  readonly adverseCurrentKt: number;
};

export type TideGateWindowOutput = {
  readonly transitHours: number;
};

export const calculateTideGateWindow = (
  gateDistanceNm: number,
  boatSpeedKt: number,
  adverseCurrentKt: number,
): number | null =>
  Number.isFinite(gateDistanceNm) &&
  Number.isFinite(boatSpeedKt) &&
  Number.isFinite(adverseCurrentKt) &&
  gateDistanceNm > 0 &&
  boatSpeedKt > 0 &&
  adverseCurrentKt >= 0 &&
  adverseCurrentKt < boatSpeedKt
    ? gateDistanceNm / (boatSpeedKt - adverseCurrentKt)
    : null;

export const tideGateWindowExample = {
  input: { gateDistanceNm: 1, boatSpeedKt: 8, adverseCurrentKt: 3 },
  output: { transitHours: 0.2 },
} satisfies ToolExample<TideGateWindowInput, TideGateWindowOutput>;

export const tideGateWindowTool = createSimpleTool({
  id: "sailing/tide-gate-window",
  title: "Tide Gate Window Calculator",
  description:
    "Calculate the hours needed to transit a tidal gate against an adverse current from the gate distance, boat speed, and current strength.",
  inputs: [
    {
      id: "gateDistanceNm",
      kind: "number",
      label: "Gate distance",
      unit: "nm",
    },
    { id: "boatSpeedKt", kind: "number", label: "Boat speed", unit: "kt" },
    {
      id: "adverseCurrentKt",
      kind: "number",
      label: "Adverse current",
      unit: "kt",
    },
  ],
  outputs: [
    {
      format: "time-h",
      id: "transitHours",
      kind: "number",
      label: "Transit time",
      unit: "h",
    },
  ],
  calculate: (input) => {
    const gate = input.gateDistanceNm as number;
    const boat = input.boatSpeedKt as number;
    const adverse = input.adverseCurrentKt as number;
    if (!(gate > 0))
      simpleError(
        "gateDistanceNm",
        "Enter a positive distance to the gate.",
        "invalid_distance",
      );
    if (!(boat > 0))
      simpleError(
        "boatSpeedKt",
        "Enter a positive boat speed.",
        "invalid_speed",
      );
    if (adverse < 0)
      simpleError(
        "adverseCurrentKt",
        "Enter a non-negative adverse current.",
        "invalid_current",
      );
    if (adverse >= boat)
      simpleError(
        "adverseCurrentKt",
        "The adverse current meets or exceeds the boat speed, so the gate cannot be transited.",
        "gate_not_transitable",
      );
    return {
      transitHours: calculateTideGateWindow(gate, boat, adverse)!,
    };
  },
});

export const runTideGateWindow = tideGateWindowTool.execute;
export default tideGateWindowTool;
