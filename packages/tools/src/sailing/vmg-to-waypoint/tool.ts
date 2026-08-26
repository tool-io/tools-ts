import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VmgToWaypointInput = {
  readonly boatSpeedKt: number;
  readonly waypointBearingOffsetDeg: number;
};

export type VmgToWaypointOutput = {
  readonly vmgKt: number;
};

export const vmgToWaypointExample = {
  input: { boatSpeedKt: 7, waypointBearingOffsetDeg: 30 },
  output: { vmgKt: 6.062177826 },
} satisfies ToolExample<VmgToWaypointInput, VmgToWaypointOutput>;

export const calculateVmgToWaypoint = (
  input: VmgToWaypointInput,
): VmgToWaypointOutput => {
  if (!(Number.isFinite(input.boatSpeedKt) && input.boatSpeedKt >= 0))
    simpleError(
      "boatSpeedKt",
      "Boat speed must be finite and non-negative.",
      "invalid_speed",
    );
  if (!(
    Number.isFinite(input.waypointBearingOffsetDeg) &&
    input.waypointBearingOffsetDeg >= -180 &&
    input.waypointBearingOffsetDeg <= 180
  ))
    simpleError(
      "waypointBearingOffsetDeg",
      "Bearing offset must lie between -180 and 180 degrees.",
      "invalid_angle",
    );
  return {
    vmgKt:
      Math.round(
        input.boatSpeedKt *
          Math.cos((input.waypointBearingOffsetDeg * Math.PI) / 180) *
          1e9,
      ) / 1e9,
  };
};

export const vmgToWaypointTool = createSimpleTool({
  calculate: (input) =>
    calculateVmgToWaypoint(input as unknown as VmgToWaypointInput),
  description:
    "Compute the velocity made good toward a waypoint given a heading offset.",
  id: "sailing/vmg-to-waypoint",
  inputs: [
    {
      description: "Boat speed through the water.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Angle between the heading and the bearing to the waypoint.",
      id: "waypointBearingOffsetDeg",
      kind: "number",
      label: "Bearing offset",
      maximum: 180,
      minimum: -180,
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Component of boat speed directed at the waypoint.",
      format: "speed",
      id: "vmgKt",
      kind: "number",
      label: "VMG",
      unit: "kt",
    },
  ],
  title: "VMG to Waypoint Calculator",
});
export const runVmgToWaypoint = vmgToWaypointTool.execute;
export default vmgToWaypointTool;
