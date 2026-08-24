import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhotonLifetimeInput = {
  readonly refractiveIndex: number;
  readonly totalLossPerCm: number;
};

export type PhotonLifetimeOutput = {
  readonly lifetimePs: number;
};

const SPEED_OF_LIGHT_CM_PER_PS = 0.0299792458;

export const photonLifetimeExample = {
  input: {
    refractiveIndex: 3,
    totalLossPerCm: 100,
  },
  output: { lifetimePs: 1.0006922855944562 },
} satisfies ToolExample<PhotonLifetimeInput, PhotonLifetimeOutput>;

export const photonLifetimeTool = createSimpleTool({
  id: "semiconductor/laser-cavity-photon-lifetime",
  title: "Photon Lifetime Calculator",
  description:
    "Compute the cavity photon lifetime from refractive index and total distributed loss using tau equals n over c times alpha.",
  inputs: [
    {
      description: "Refractive index of the cavity medium.",
      id: "refractiveIndex",
      kind: "number",
      label: "Refractive index",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Total distributed loss per unit length.",
      id: "totalLossPerCm",
      kind: "number",
      label: "Total loss",
      minimum: Number.MIN_VALUE,
      unit: "cm⁻¹",
    },
  ],
  outputs: [
    {
      description: "Average time a photon remains in the cavity.",
      format: "duration",
      id: "lifetimePs",
      kind: "number",
      label: "Photon lifetime",
      minimum: Number.MIN_VALUE,
      unit: "ps",
    },
  ],
  calculate: (input) => {
    const refractiveIndex = input.refractiveIndex as number;
    const totalLossPerCm = input.totalLossPerCm as number;
    if (!(refractiveIndex > 0))
      simpleError(
        "refractiveIndex",
        "Refractive index must be positive.",
        "invalid_index",
      );
    if (!(totalLossPerCm > 0))
      simpleError(
        "totalLossPerCm",
        "Total loss must be positive.",
        "invalid_loss",
      );
    return {
      lifetimePs: refractiveIndex / (SPEED_OF_LIGHT_CM_PER_PS * totalLossPerCm),
    };
  },
});
export const runPhotonLifetime = photonLifetimeTool.execute;
export default photonLifetimeTool;
