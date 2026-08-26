import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PolarVmgMaxUpwindInput = {
  readonly targetBoatSpeedKt: number;
  readonly trueWindAngleDeg: number;
};

export type PolarVmgMaxUpwindOutput = {
  readonly velocityMadeGoodKt: number;
};

export const polarVmgMaxUpwindExample = {
  input: { targetBoatSpeedKt: 7, trueWindAngleDeg: 45 },
  output: { velocityMadeGoodKt: 4.949747468305833 },
} satisfies ToolExample<PolarVmgMaxUpwindInput, PolarVmgMaxUpwindOutput>;

export const calculatePolarVmgMaxUpwind = (
  input: PolarVmgMaxUpwindInput,
): PolarVmgMaxUpwindOutput => {
  if (input.targetBoatSpeedKt <= 0)
    simpleError(
      "targetBoatSpeedKt",
      "The target boat speed must be positive.",
      "invalid_input",
    );
  return {
    velocityMadeGoodKt:
      input.targetBoatSpeedKt *
      Math.cos((input.trueWindAngleDeg * Math.PI) / 180),
  };
};

export const polarVmgMaxUpwindTool = createSimpleTool({
  calculate: (input) =>
    calculatePolarVmgMaxUpwind(input as unknown as PolarVmgMaxUpwindInput),
  description:
    "Compute upwind velocity made good as target boat speed times the cosine of the true wind angle.",
  id: "sailing/polar-vmg-max-upwind",
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
        "True wind angle off the bow between zero and ninety degrees.",
      format: "angle-deg",
      id: "trueWindAngleDeg",
      kind: "number",
      label: "True wind angle",
      maximum: 90,
      minimum: 0,
      unit: "deg",
    },
  ],
  outputs: [
    {
      description: "Component of boat speed made good directly upwind.",
      format: "speed-kt",
      id: "velocityMadeGoodKt",
      kind: "number",
      label: "Velocity made good",
      unit: "kt",
    },
  ],
  title: "Upwind VMG Calculator",
});
export const runPolarVmgMaxUpwind = polarVmgMaxUpwindTool.execute;
export default polarVmgMaxUpwindTool;
