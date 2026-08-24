import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MosfetBodyEffectInput = {
  readonly bodyBiasV: number;
  readonly gammaV05: number;
  readonly phiF: number;
};

export type MosfetBodyEffectOutput = {
  readonly thresholdShiftV: number;
};

const PHI_F_300K = 0.6;

export const mosfetBodyEffectExample = {
  input: { bodyBiasV: 1, gammaV05: 0.4, phiF: PHI_F_300K },
  output: { thresholdShiftV: 0.15511783296352022 },
} satisfies ToolExample<MosfetBodyEffectInput, MosfetBodyEffectOutput>;

export const calculateMosfetBodyEffect = (
  input: MosfetBodyEffectInput,
): MosfetBodyEffectOutput => {
  const gamma = input.gammaV05;
  const phiF = input.phiF;
  if (!Number.isFinite(gamma) || gamma < 0)
    simpleError(
      "gammaV05",
      "The body-effect coefficient must be finite and nonnegative.",
      "invalid_input",
    );
  if (!Number.isFinite(phiF) || phiF <= 0)
    simpleError("phiF", "Fermi potential must be finite and positive.");
  if (!Number.isFinite(input.bodyBiasV) || input.bodyBiasV < 0)
    simpleError("bodyBiasV", "Source-body reverse bias must be nonnegative.");
  return {
    thresholdShiftV:
      gamma * (Math.sqrt(2 * phiF + input.bodyBiasV) - Math.sqrt(2 * phiF)),
  };
};

export const mosfetBodyEffectTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetBodyEffect({
      bodyBiasV: input.bodyBiasV as number,
      gammaV05: input.gammaV05 as number,
      phiF: input.phiF as number,
    }),
  description:
    "Compute the MOSFET threshold-voltage shift caused by source-body reverse bias.",
  id: "semiconductor/mosfet-body-effect-coefficient",
  inputs: [
    {
      description: "Source-to-body reverse bias.",
      id: "bodyBiasV",
      kind: "number",
      label: "VSB",
      unit: "V",
      minimum: 0,
    },
    {
      description: "Body-effect coefficient.",
      format: "factor",
      id: "gammaV05",
      kind: "number",
      label: "Gamma",
      unit: "V^0.5",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Fermi potential phiF in volts.",
      format: "voltage-v",
      id: "phiF",
      kind: "number",
      label: "φF",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Threshold-voltage increase caused by the body effect.",
      format: "voltage-v",
      id: "thresholdShiftV",
      kind: "number",
      label: "ΔVT",
      minimum: 0,
      unit: "V",
    },
  ],
  title: "MOSFET Body-Effect Shift Calculator",
});
export const runMosfetBodyEffect = mosfetBodyEffectTool.execute;
export default mosfetBodyEffectTool;
