import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const WKB_COEFFICIENT_PER_ANGSTROM_SQRT_EV = 1.0246334452601815;

export type WkbTunnelingProbabilityInput = {
  readonly barrierHeightEv: number;
  readonly barrierWidthNm: number;
  readonly effectiveMassRatio?: number;
};

export type WkbTunnelingProbabilityOutput = {
  readonly transmissionProbability: number;
};

export const wkbTunnelingProbabilityExample = {
  input: { barrierHeightEv: 1, barrierWidthNm: 1 },
  output: { transmissionProbability: 0.00003548734327205117 },
} satisfies ToolExample<
  WkbTunnelingProbabilityInput,
  WkbTunnelingProbabilityOutput
>;

export const wkbTunnelingProbabilityTool = createSimpleTool({
  id: "semiconductor/quantum-tunneling-probability-wkb",
  title: "WKB Tunneling Probability Calculator",
  description:
    "Estimate transmission through a rectangular barrier with the WKB approximation from the barrier energy above the particle, width, and effective mass.",
  inputs: [
    {
      description: "Barrier energy above the incident particle energy.",
      id: "barrierHeightEv",
      kind: "number",
      label: "Barrier height",
      unit: "eV",
    },
    {
      description: "Physical thickness of the barrier.",
      id: "barrierWidthNm",
      kind: "number",
      label: "Barrier width",
      unit: "nm",
    },
    {
      default: 1,
      description: "Particle effective mass divided by the free-electron mass.",
      id: "effectiveMassRatio",
      kind: "number",
      label: "Effective mass ratio",
    },
  ],
  outputs: [
    {
      description: "Approximate transmission probability.",
      format: "probability",
      id: "transmissionProbability",
      kind: "number",
      label: "Transmission probability",
    },
  ],
  calculate: (input) => {
    const barrierHeightEv = input.barrierHeightEv as number;
    const barrierWidthNm = input.barrierWidthNm as number;
    const effectiveMassRatio = input.effectiveMassRatio as number;
    if (!(barrierHeightEv > 0))
      simpleError(
        "barrierHeightEv",
        "Barrier height must be greater than zero.",
      );
    if (!(barrierWidthNm > 0))
      simpleError("barrierWidthNm", "Barrier width must be greater than zero.");
    if (!(effectiveMassRatio > 0))
      simpleError(
        "effectiveMassRatio",
        "Effective mass ratio must be greater than zero.",
      );
    const exponent =
      -WKB_COEFFICIENT_PER_ANGSTROM_SQRT_EV *
      (barrierWidthNm * 10) *
      Math.sqrt(barrierHeightEv) *
      Math.sqrt(effectiveMassRatio);
    if (!Number.isFinite(exponent) || exponent < Math.log(Number.MIN_VALUE))
      simpleError(
        "barrierWidthNm",
        "The transmission probability is below floating-point resolution.",
        "result_underflow",
      );
    return {
      transmissionProbability: Math.exp(exponent),
    };
  },
});
export const runWkbTunnelingProbability = wkbTunnelingProbabilityTool.execute;
export default wkbTunnelingProbabilityTool;
