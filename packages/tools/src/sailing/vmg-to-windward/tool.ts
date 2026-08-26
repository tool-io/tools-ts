import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VmgToWindwardInput = {
  readonly boatSpeedKt: number;
  readonly trueWindAngleDeg: number;
};

export type VmgToWindwardOutput = {
  readonly vmgKt: number;
};

export const vmgToWindwardExample = {
  input: { boatSpeedKt: 7, trueWindAngleDeg: 45 },
  output: { vmgKt: 4.949747468 },
} satisfies ToolExample<VmgToWindwardInput, VmgToWindwardOutput>;

export const calculateVmgToWindward = (
  input: VmgToWindwardInput,
): VmgToWindwardOutput => {
  if (!(Number.isFinite(input.boatSpeedKt) && input.boatSpeedKt >= 0))
    simpleError(
      "boatSpeedKt",
      "Boat speed must be finite and non-negative.",
      "invalid_speed",
    );
  if (!(
    Number.isFinite(input.trueWindAngleDeg) &&
    input.trueWindAngleDeg >= 0 &&
    input.trueWindAngleDeg <= 90
  ))
    simpleError(
      "trueWindAngleDeg",
      "Windward VMG uses a true-wind angle from zero to 90 degrees.",
      "invalid_angle",
    );
  const rad = (input.trueWindAngleDeg * Math.PI) / 180;
  return {
    vmgKt: Math.round(input.boatSpeedKt * Math.cos(rad) * 1e9) / 1e9,
  };
};

export const vmgToWindwardTool = createSimpleTool({
  calculate: (input) =>
    calculateVmgToWindward(input as unknown as VmgToWindwardInput),
  description:
    "Compute velocity made good to windward from boat speed and true wind angle.",
  id: "sailing/vmg-to-windward",
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
      description: "True wind angle relative to the bow.",
      id: "trueWindAngleDeg",
      kind: "number",
      label: "TWA",
      maximum: 90,
      minimum: 0,
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Component of boat speed directly upwind.",
      format: "speed",
      id: "vmgKt",
      kind: "number",
      label: "VMG",
      unit: "kt",
    },
  ],
  title: "VMG to Windward Calculator",
});
export const runVmgToWindward = vmgToWindwardTool.execute;
export default vmgToWindwardTool;
