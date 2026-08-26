import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PolarVmgMaxDownwindInput = {
  readonly targetBoatSpeedKt: number;
  readonly trueWindAngleDeg: number;
};

export type PolarVmgMaxDownwindOutput = {
  readonly velocityMadeGoodKt: number;
};

export const polarVmgMaxDownwindExample = {
  input: { targetBoatSpeedKt: 7, trueWindAngleDeg: 135 },
  output: { velocityMadeGoodKt: 4.949747468305832 },
} satisfies ToolExample<PolarVmgMaxDownwindInput, PolarVmgMaxDownwindOutput>;

export const calculatePolarVmgMaxDownwind = (
  input: PolarVmgMaxDownwindInput,
): PolarVmgMaxDownwindOutput => {
  if (input.targetBoatSpeedKt <= 0)
    simpleError(
      "targetBoatSpeedKt",
      "The target boat speed must be positive.",
      "invalid_input",
    );
  return {
    velocityMadeGoodKt:
      input.targetBoatSpeedKt *
      Math.abs(Math.cos((input.trueWindAngleDeg * Math.PI) / 180)),
  };
};

export const polarVmgMaxDownwindTool = createSimpleTool({
  calculate: (input) =>
    calculatePolarVmgMaxDownwind(input as unknown as PolarVmgMaxDownwindInput),
  description:
    "Compute downwind velocity made good as target boat speed times the absolute cosine of the true wind angle.",
  id: "sailing/polar-vmg-max-downwind",
  inputs: [
    {
      description: "Target boat speed from the polar at this wind angle.",
      format: "speed-kt",
      id: "targetBoatSpeedKt",
      kind: "number",
      label: "Target boat speed",
      unit: "kt",
    },
    {
      description:
        "True wind angle off the bow between ninety and one hundred eighty degrees.",
      format: "angle-deg",
      id: "trueWindAngleDeg",
      kind: "number",
      label: "True wind angle",
      maximum: 180,
      minimum: 90,
      unit: "deg",
    },
  ],
  outputs: [
    {
      description: "Component of boat speed made good directly downwind.",
      format: "speed-kt",
      id: "velocityMadeGoodKt",
      kind: "number",
      label: "Velocity made good",
      unit: "kt",
    },
  ],
  title: "Downwind VMG Calculator",
});
export const runPolarVmgMaxDownwind = polarVmgMaxDownwindTool.execute;
export default polarVmgMaxDownwindTool;
