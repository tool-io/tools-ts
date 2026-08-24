import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GateTunnelingCurrentInput = {
  readonly attenuationPerNm: number;
  readonly oxideThicknessNm: number;
  readonly prefactorPicoAPerUm2: number;
};

export type GateTunnelingCurrentOutput = {
  readonly gateLeakagePAperUm2: number;
};

export const gateTunnelingCurrentExample = {
  input: {
    attenuationPerNm: 3,
    oxideThicknessNm: 2,
    prefactorPicoAPerUm2: 1000,
  },
  output: { gateLeakagePAperUm2: 2.4787521766663585 },
} satisfies ToolExample<GateTunnelingCurrentInput, GateTunnelingCurrentOutput>;

export const gateTunnelingCurrentTool = createSimpleTool({
  calculate: (input) => {
    const attenuationPerNm = input.attenuationPerNm as number;
    const oxideThicknessNm = input.oxideThicknessNm as number;
    const prefactorPicoAPerUm2 = input.prefactorPicoAPerUm2 as number;
    const attenuation = attenuationPerNm;
    if (!(oxideThicknessNm > 0))
      simpleError(
        "oxideThicknessNm",
        "Oxide thickness must be positive.",
        "invalid_oxide_thickness",
      );
    if (!(attenuation > 0))
      simpleError(
        "attenuationPerNm",
        "Attenuation length must be positive.",
        "invalid_attenuation",
      );
    if (!(prefactorPicoAPerUm2 > 0))
      simpleError(
        "prefactorPicoAPerUm2",
        "Calibrated current-density prefactor must be positive.",
        "invalid_prefactor",
      );
    const gateLeakagePAperUm2 =
      prefactorPicoAPerUm2 * Math.exp(-attenuation * oxideThicknessNm);
    if (gateLeakagePAperUm2 === 0)
      simpleError(
        "oxideThicknessNm",
        "The tunneling current density is too small to represent.",
        "numeric_underflow",
      );
    return {
      gateLeakagePAperUm2,
    };
  },
  description:
    "Evaluate a calibrated gate-oxide tunneling current-density exponential from oxide thickness, attenuation, and prefactor.",
  id: "semiconductor/gate-tunneling-current",
  inputs: [
    {
      description:
        "Exponential attenuation per nanometer from a calibrated tunneling fit.",
      id: "attenuationPerNm",
      kind: "number",
      label: "Attenuation per nm",
      minimum: Number.MIN_VALUE,
      unit: "1/nm",
    },
    {
      description: "Gate oxide thickness.",
      format: "length-nm",
      id: "oxideThicknessNm",
      kind: "number",
      label: "Oxide thickness",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description: "Current-density prefactor from the same calibrated fit.",
      id: "prefactorPicoAPerUm2",
      kind: "number",
      label: "Tunneling prefactor",
      minimum: Number.MIN_VALUE,
      unit: "pA/um^2",
    },
  ],
  outputs: [
    {
      description: "Gate tunneling leakage current density.",
      format: "current-density-pa-per-um2",
      id: "gateLeakagePAperUm2",
      kind: "number",
      label: "Gate leakage density",
      minimum: Number.MIN_VALUE,
      unit: "pA/um^2",
    },
  ],
  title: "Gate Tunneling Current Calculator",
});
export const runGateTunnelingCurrent = gateTunnelingCurrentTool.execute;
export default gateTunnelingCurrentTool;
