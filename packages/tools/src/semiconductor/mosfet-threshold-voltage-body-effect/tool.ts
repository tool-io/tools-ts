import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const mosfetThresholdVoltageBodyEffectExample = {
  input: { bodyBiasV: 1, gammaV05: 0.4, phiFV: 0.6, vt0V: 0.7 },
  output: { thresholdVoltageV: 0.8551178329635202 },
} satisfies ToolExample<MosfetBodyEffectInput, MosfetBodyEffectOutput>;

export type MosfetBodyEffectInput = {
  readonly bodyBiasV: number;
  readonly gammaV05: number;
  readonly phiFV: number;
  readonly vt0V: number;
};
export type MosfetBodyEffectOutput = { readonly thresholdVoltageV: number };

export const calculateMosfetThresholdVoltageBodyEffect = (
  input: MosfetBodyEffectInput,
): MosfetBodyEffectOutput => {
  if (input.bodyBiasV < 0 || input.gammaV05 < 0 || input.phiFV <= 0)
    simpleError(
      "bodyBiasV",
      "All inputs must be non-negative.",
      "invalid_input",
    );
  const twoPhi = 2 * input.phiFV;
  return {
    thresholdVoltageV:
      input.vt0V +
      input.gammaV05 *
        (Math.sqrt(twoPhi + input.bodyBiasV) - Math.sqrt(twoPhi)),
  };
};

export const mosfetThresholdVoltageBodyEffectTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetThresholdVoltageBodyEffect({
      bodyBiasV: input.bodyBiasV as number,
      gammaV05: input.gammaV05 as number,
      phiFV: input.phiFV as number,
      vt0V: input.vt0V as number,
    }),
  description:
    "Compute threshold voltage with source-body reverse bias applied.",
  id: "semiconductor/mosfet-threshold-voltage-body-effect",
  inputs: [
    {
      description: "Source-to-body voltage.",
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
      minimum: 0,
    },
    {
      description: "Fermi potential magnitude; the formula uses 2 phi F.",
      format: "voltage-v",
      id: "phiFV",
      kind: "number",
      label: "phi F",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
    {
      default: 0.7,
      description: "Zero-bias threshold voltage.",
      format: "voltage-v",
      id: "vt0V",
      kind: "number",
      label: "VT0",
      unit: "V",
    },
  ],
  outputs: [
    {
      format: "voltage-v",
      id: "thresholdVoltageV",
      kind: "number",
      label: "VT",
      unit: "V",
    },
  ],
  title: "MOSFET Threshold Voltage Body Effect Calculator",
});
export const runMosfetThresholdVoltageBodyEffect =
  mosfetThresholdVoltageBodyEffectTool.execute;
export default mosfetThresholdVoltageBodyEffectTool;
