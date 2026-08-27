import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CoefficientOfVolumeCompressibilityInput = {
  readonly voidRatioDecrease: number;
  readonly effectiveStressIncreaseKpa: number;
  readonly initialVoidRatio: number;
};

export type CoefficientOfVolumeCompressibilityOutput = {
  readonly coefficientOfVolumeCompressibilityPerKpa: number;
};

export const calculateCoefficientOfVolumeCompressibility = (
  input: CoefficientOfVolumeCompressibilityInput,
): CoefficientOfVolumeCompressibilityOutput => {
  if (!(input.voidRatioDecrease > 0))
    simpleError(
      "voidRatioDecrease",
      "Void ratio decrease must be greater than zero.",
      "invalid_void_ratio",
    );
  if (!(input.effectiveStressIncreaseKpa > 0))
    simpleError(
      "effectiveStressIncreaseKpa",
      "Effective stress increase must be greater than zero.",
      "invalid_stress",
    );
  if (!(input.initialVoidRatio >= 0))
    simpleError(
      "initialVoidRatio",
      "Initial void ratio must be non-negative.",
      "invalid_void_ratio",
    );
  return {
    coefficientOfVolumeCompressibilityPerKpa:
      input.voidRatioDecrease /
      input.effectiveStressIncreaseKpa /
      (1 + input.initialVoidRatio),
  };
};

export const coefficientOfVolumeCompressibilityExample = {
  input: {
    voidRatioDecrease: 0.2,
    effectiveStressIncreaseKpa: 100,
    initialVoidRatio: 1,
  },
  output: { coefficientOfVolumeCompressibilityPerKpa: 0.001 },
} satisfies ToolExample<
  CoefficientOfVolumeCompressibilityInput,
  CoefficientOfVolumeCompressibilityOutput
>;

export const coefficientOfVolumeCompressibilityTool = createSimpleTool({
  id: "geology/coefficient-of-volume-compressibility",
  title: "Coefficient Of Volume Compressibility Calculator",
  description:
    "Coefficient of volume compressibility mv = av / (1 + e0), where av = de / d_sigma' is the slope of the e - sigma' curve over a loading increment. Result in 1/kPa.",
  inputs: [
    {
      description:
        "Decrease in void ratio de over the increment, dimensionless.",
      id: "voidRatioDecrease",
      kind: "number",
      label: "de",
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
      description: "Initial void ratio e0 at the start of the increment.",
      id: "initialVoidRatio",
      kind: "number",
      label: "e0",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Coefficient of volume compressibility mv in 1/kPa.",
      id: "coefficientOfVolumeCompressibilityPerKpa",
      kind: "number",
      label: "mv",
    },
  ],
  calculate: (input) =>
    calculateCoefficientOfVolumeCompressibility(
      input as unknown as CoefficientOfVolumeCompressibilityInput,
    ),
});

export const runCoefficientOfVolumeCompressibility =
  coefficientOfVolumeCompressibilityTool.execute;
export default coefficientOfVolumeCompressibilityTool;
