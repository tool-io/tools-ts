import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VmgToLeewardInput = {
  readonly boatSpeedKt: number;
  readonly trueWindAngleDeg: number;
};

export type VmgToLeewardOutput = {
  readonly vmgKt: number;
};

export const vmgToLeewardExample = {
  input: { boatSpeedKt: 8, trueWindAngleDeg: 150 },
  output: { vmgKt: 6.92820323 },
} satisfies ToolExample<VmgToLeewardInput, VmgToLeewardOutput>;

export const calculateVmgToLeeward = (
  input: VmgToLeewardInput,
): VmgToLeewardOutput => {
  if (!(Number.isFinite(input.boatSpeedKt) && input.boatSpeedKt >= 0))
    simpleError(
      "boatSpeedKt",
      "Boat speed must be finite and non-negative.",
      "invalid_speed",
    );
  if (!(
    Number.isFinite(input.trueWindAngleDeg) &&
    input.trueWindAngleDeg >= 90 &&
    input.trueWindAngleDeg <= 180
  ))
    simpleError(
      "trueWindAngleDeg",
      "Leeward VMG uses a true-wind angle from 90 to 180 degrees.",
      "invalid_angle",
    );
  const rad = (input.trueWindAngleDeg * Math.PI) / 180;
  return {
    vmgKt: Math.round(input.boatSpeedKt * Math.cos(rad) * -1e9) / 1e9,
  };
};

export const vmgToLeewardTool = createSimpleTool({
  calculate: (input) =>
    calculateVmgToLeeward(input as unknown as VmgToLeewardInput),
  description:
    "Compute velocity made good to leeward from boat speed and true wind angle on a run.",
  id: "sailing/vmg-to-leeward",
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
      maximum: 180,
      minimum: 90,
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Component of boat speed directly downwind.",
      format: "speed",
      id: "vmgKt",
      kind: "number",
      label: "VMG",
      unit: "kt",
    },
  ],
  title: "VMG to Leeward Calculator",
});
export const runVmgToLeeward = vmgToLeewardTool.execute;
export default vmgToLeewardTool;
