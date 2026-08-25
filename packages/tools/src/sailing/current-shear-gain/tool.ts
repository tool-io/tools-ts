import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentShearGainInput = {
  readonly deeperLayerKt: number;
  readonly nearSurfaceKt: number;
};

export type CurrentShearGainOutput = {
  readonly shearGainKt: number;
};

export const calculateCurrentShearGain = (
  input: CurrentShearGainInput,
): CurrentShearGainOutput | null =>
  Number.isFinite(input.nearSurfaceKt) &&
  Number.isFinite(input.deeperLayerKt) &&
  input.nearSurfaceKt >= 0 &&
  input.deeperLayerKt >= 0
    ? { shearGainKt: input.nearSurfaceKt - input.deeperLayerKt }
    : null;

export const currentShearGainExample = {
  input: { deeperLayerKt: 1.25, nearSurfaceKt: 2.5 },
  output: { shearGainKt: 1.25 },
} satisfies ToolExample<CurrentShearGainInput, CurrentShearGainOutput>;

export const currentShearGainTool = createSimpleTool({
  id: "sailing/current-shear-gain",
  title: "Current Shear Gain",
  description:
    "Compute the signed current shear across the boundary between the near surface layer and the deeper layer as the near surface speed minus the deeper layer speed.",
  inputs: [
    {
      description: "Current speed in the near surface layer.",
      id: "nearSurfaceKt",
      kind: "number",
      label: "Near surface current",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Current speed in the deeper layer.",
      id: "deeperLayerKt",
      kind: "number",
      label: "Deeper layer current",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Signed shear in knots; positive when the surface runs faster than the depth.",
      id: "shearGainKt",
      kind: "number",
      label: "Shear gain",
      unit: "kt",
    },
  ],
  calculate: (input) => {
    const shearGainKt = calculateCurrentShearGain(
      input as unknown as CurrentShearGainInput,
    );
    if (shearGainKt === null)
      simpleError(
        "nearSurfaceKt",
        "Layer speeds must be finite and not negative.",
        "invalid_value",
      );
    return shearGainKt;
  },
});

export const runCurrentShearGain = currentShearGainTool.execute;
export default currentShearGainTool;
