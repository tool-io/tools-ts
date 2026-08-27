import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InductorSaturationMarginCheckInput = {
  readonly peakOperatingAmps: number;
  readonly saturationCurrentAmps: number;
};

export type InductorSaturationMarginCheckOutput = {
  readonly saturationMarginPercent: number;
};

export const inductorSaturationMarginCheckExample = {
  input: { peakOperatingAmps: 2, saturationCurrentAmps: 3 },
  output: { saturationMarginPercent: 50 },
} satisfies ToolExample<
  InductorSaturationMarginCheckInput,
  InductorSaturationMarginCheckOutput
>;

export const calculateInductorSaturationMarginCheck = (
  input: InductorSaturationMarginCheckInput,
): InductorSaturationMarginCheckOutput => {
  if (!(input.saturationCurrentAmps > 0))
    simpleError(
      "saturationCurrentAmps",
      "Saturation current must be positive.",
      "invalid_current",
    );
  if (!(input.peakOperatingAmps > 0))
    simpleError(
      "peakOperatingAmps",
      "Peak operating current must be positive.",
      "invalid_current",
    );
  return {
    saturationMarginPercent:
      (input.saturationCurrentAmps / input.peakOperatingAmps - 1) * 100,
  };
};

export const inductorSaturationMarginCheckTool = createSimpleTool({
  calculate: (input) =>
    calculateInductorSaturationMarginCheck(
      input as unknown as InductorSaturationMarginCheckInput,
    ),
  description:
    "Compare the peak operating current of an inductor against its saturation current and report the signed margin percent; negative values mean saturation is exceeded.",
  id: "electronics/inductor-saturation-margin-check",
  inputs: [
    {
      description: "Current at which the core saturates.",
      id: "saturationCurrentAmps",
      kind: "number",
      label: "Saturation current",
      unit: "A",
    },
    {
      description: "Peak operating current through the inductor.",
      id: "peakOperatingAmps",
      kind: "number",
      label: "Peak operating current",
      unit: "A",
    },
  ],
  outputs: [
    {
      description:
        "Signed headroom before saturation in percent, negative when exceeded.",
      id: "saturationMarginPercent",
      kind: "number",
      label: "Saturation margin",
      unit: "%",
    },
  ],
  title: "Saturation Margin",
});
export const runInductorSaturationMarginCheck =
  inductorSaturationMarginCheckTool.execute;
export default inductorSaturationMarginCheckTool;
