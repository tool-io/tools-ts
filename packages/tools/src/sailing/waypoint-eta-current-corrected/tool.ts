import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaypointEtaCurrentCorrectedInput = {
  readonly boatSpeedKt: number;
  readonly courseDeg: number;
  readonly currentKt: number;
  readonly currentSetDeg: number;
  readonly distanceNm: number;
};

export type WaypointEtaCurrentCorrectedOutput = {
  readonly etaHours: number;
  readonly speedOverGroundKt: number;
};

const normalizeAngleRad = (value: number): number => value * (Math.PI / 180);

export const calculateWaypointEtaCurrentCorrected = (
  input: WaypointEtaCurrentCorrectedInput,
): WaypointEtaCurrentCorrectedOutput | null => {
  if (!(
    Number.isFinite(input.boatSpeedKt) &&
    Number.isFinite(input.currentKt) &&
    Number.isFinite(input.distanceNm) &&
    Number.isFinite(input.courseDeg) &&
    Number.isFinite(input.currentSetDeg) &&
    input.boatSpeedKt > 0 &&
    input.distanceNm > 0 &&
    input.currentKt >= 0 &&
    input.courseDeg >= 0 &&
    input.courseDeg <= 360 &&
    input.currentSetDeg >= 0 &&
    input.currentSetDeg <= 360
  ))
    return null;
  const relativeCurrentAngle = normalizeAngleRad(
    input.currentSetDeg - input.courseDeg,
  );
  const currentAlongTrackKt = input.currentKt * Math.cos(relativeCurrentAngle);
  const currentCrossTrackKt = input.currentKt * Math.sin(relativeCurrentAngle);
  if (Math.abs(currentCrossTrackKt) > input.boatSpeedKt) return null;
  const boatAlongTrackKt = Math.sqrt(
    Math.max(0, input.boatSpeedKt ** 2 - currentCrossTrackKt ** 2),
  );
  const speedOverGroundKt = boatAlongTrackKt + currentAlongTrackKt;
  if (!(speedOverGroundKt > 0)) return null;
  return {
    speedOverGroundKt,
    etaHours: input.distanceNm / speedOverGroundKt,
  };
};

export const waypointEtaCurrentCorrectedExample = {
  input: {
    boatSpeedKt: 3,
    courseDeg: 90,
    currentKt: 1,
    currentSetDeg: 90,
    distanceNm: 8,
  },
  output: { etaHours: 2, speedOverGroundKt: 4 },
} satisfies ToolExample<
  WaypointEtaCurrentCorrectedInput,
  WaypointEtaCurrentCorrectedOutput
>;

export const waypointEtaCurrentCorrectedTool = createSimpleTool({
  id: "sailing/waypoint-eta-current-corrected",
  title: "Corrected Waypoint ETA",
  description:
    "Compute ETA along a waypoint track while allowing for current: the boat first cancels the cross-current component, and its remaining along-track speed is combined with the current's along-track component.",
  inputs: [
    {
      description: "Boat speed through the water.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      unit: "kt",
    },
    {
      description: "Desired course over ground to the waypoint.",
      id: "courseDeg",
      kind: "number",
      label: "Course",
      unit: "\u00B0",
    },
    {
      description: "Current strength.",
      id: "currentKt",
      kind: "number",
      label: "Current",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Direction the current flows toward.",
      id: "currentSetDeg",
      kind: "number",
      label: "Current set",
      unit: "\u00B0",
    },
    {
      description: "Distance to the waypoint over ground.",
      id: "distanceNm",
      kind: "number",
      label: "Distance",
      unit: "NM",
    },
  ],
  outputs: [
    {
      description: "Resulting speed over ground with current applied.",
      format: "speed-kt",
      id: "speedOverGroundKt",
      kind: "number",
      label: "Speed over ground",
      unit: "kt",
    },
    {
      description: "Hours until the waypoint at that speed over ground.",
      format: "duration-h",
      id: "etaHours",
      kind: "number",
      label: "ETA",
      unit: "h",
    },
  ],
  calculate: (input) => {
    const output = calculateWaypointEtaCurrentCorrected(
      input as unknown as WaypointEtaCurrentCorrectedInput,
    );
    if (output === null)
      simpleError(
        "boatSpeedKt",
        "Inputs must be finite and in range, and the boat must be able to cancel the cross-current while making positive progress toward the waypoint.",
        "invalid_value",
      );
    return output;
  },
});

export const runWaypointEtaCurrentCorrected =
  waypointEtaCurrentCorrectedTool.execute;
export default waypointEtaCurrentCorrectedTool;
