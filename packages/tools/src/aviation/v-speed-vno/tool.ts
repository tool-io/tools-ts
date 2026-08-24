import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VSpeedVnoInput = {
  readonly neverExceedSpeedKt: number;
  readonly vnoToVneRatio: number;
};

export type VSpeedVnoOutput = {
  readonly vnoKt: number;
};

export const vSpeedVnoExample = {
  input: { neverExceedSpeedKt: 200, vnoToVneRatio: 0.74 },
  output: { vnoKt: 148 },
} satisfies ToolExample<VSpeedVnoInput, VSpeedVnoOutput>;

export const calculateVSpeedVno = (input: VSpeedVnoInput): VSpeedVnoOutput => {
  if (input.neverExceedSpeedKt <= 0)
    simpleError(
      "neverExceedSpeedKt",
      "The never-exceed speed must be greater than zero.",
      "invalid_never_exceed_speed",
    );
  if (!(input.vnoToVneRatio > 0 && input.vnoToVneRatio <= 1))
    simpleError(
      "vnoToVneRatio",
      "The VNO/VNE ratio must be greater than zero and at most one.",
    );
  return { vnoKt: input.neverExceedSpeedKt * input.vnoToVneRatio };
};

export const vSpeedVnoTool = createSimpleTool({
  calculate: (input) =>
    calculateVSpeedVno({
      neverExceedSpeedKt: input.neverExceedSpeedKt as number,
      vnoToVneRatio: input.vnoToVneRatio as number,
    }),
  description:
    "Calculate VNO from VNE and an aircraft-specific ratio. VNO is a certified operating limitation and cannot be derived from a universal VNO/VNE constant; use a ratio backed by the aircraft documentation.",
  id: "aviation/v-speed-vno",
  inputs: [
    {
      description: "Never-exceed speed of the aircraft.",
      id: "neverExceedSpeedKt",
      kind: "number",
      label: "Never-exceed speed",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Aircraft-specific VNO divided by VNE.",
      id: "vnoToVneRatio",
      kind: "number",
      label: "VNO/VNE ratio",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Maximum structural cruising speed calculated from the supplied aircraft-specific ratio.",
      format: "speed",
      id: "vnoKt",
      kind: "number",
      label: "VNO",
      unit: "kt",
    },
  ],
  title: "VNO Speed Calculator",
});
export const runVSpeedVno = vSpeedVnoTool.execute;
export default vSpeedVnoTool;
