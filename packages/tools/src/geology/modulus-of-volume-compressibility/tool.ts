import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ModulusOfVolumeCompressibilityInput = {
  readonly initialVoidRatio: number;
  readonly effectiveStressIncreaseKpa: number;
  readonly voidRatioDecrease: number;
};

export type ModulusOfVolumeCompressibilityOutput = {
  readonly constrainedModulusKpa: number;
};

export const calculateModulusOfVolumeCompressibility = (
  input: ModulusOfVolumeCompressibilityInput,
): ModulusOfVolumeCompressibilityOutput => {
  if (!(input.initialVoidRatio >= 0))
    simpleError(
      "initialVoidRatio",
      "Initial void ratio must be non-negative.",
      "invalid_void_ratio",
    );
  if (!(input.effectiveStressIncreaseKpa > 0))
    simpleError(
      "effectiveStressIncreaseKpa",
      "Effective stress increase must be greater than zero.",
      "invalid_stress",
    );
  if (!(input.voidRatioDecrease > 0))
    simpleError(
      "voidRatioDecrease",
      "Void ratio decrease must be greater than zero.",
      "invalid_void_ratio",
    );
  return {
    constrainedModulusKpa:
      ((1 + input.initialVoidRatio) * input.effectiveStressIncreaseKpa) /
      input.voidRatioDecrease,
  };
};

export const modulusOfVolumeCompressibilityExample = {
  input: {
    initialVoidRatio: 1,
    effectiveStressIncreaseKpa: 100,
    voidRatioDecrease: 0.2,
  },
  output: { constrainedModulusKpa: 1000 },
} satisfies ToolExample<
  ModulusOfVolumeCompressibilityInput,
  ModulusOfVolumeCompressibilityOutput
>;

export const modulusOfVolumeCompressibilityTool = createSimpleTool({
  id: "geology/modulus-of-volume-compressibility",
  title: "Modulus Of Volume Compressibility Calculator",
  description:
    "Oedometric (constrained) modulus E_oed = (1 + e0) * d_sigma' / de = 1 / mv from a consolidation loading increment. Void ratios dimensionless, stresses in kPa.",
  inputs: [
    {
      description: "Initial void ratio e0 at the start of the increment.",
      id: "initialVoidRatio",
      kind: "number",
      label: "e0",
      minimum: 0,
    },
    {
      description: "Effective stress increase d_sigma' in kPa.",
      id: "effectiveStressIncreaseKpa",
      kind: "number",
      label: "d sigma'",
      minimum: 0,
    },
    {
      description: "Decrease in void ratio de over the increment.",
      id: "voidRatioDecrease",
      kind: "number",
      label: "de",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Constrained modulus E_oed in kPa.",
      id: "constrainedModulusKpa",
      kind: "number",
      label: "E oed",
    },
  ],
  calculate: (input) =>
    calculateModulusOfVolumeCompressibility(
      input as unknown as ModulusOfVolumeCompressibilityInput,
    ),
});

export const runModulusOfVolumeCompressibility =
  modulusOfVolumeCompressibilityTool.execute;
export default modulusOfVolumeCompressibilityTool;
