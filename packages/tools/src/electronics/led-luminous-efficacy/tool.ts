import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LedLuminousEfficacyInput = {
  readonly luminousFluxLm: number;
  readonly powerWatts: number;
};

export type LedLuminousEfficacyOutput = {
  readonly efficacyLumensPerWatt: number;
};

export const ledLuminousEfficacyExample = {
  input: { luminousFluxLm: 800, powerWatts: 10 },
  output: { efficacyLumensPerWatt: 80 },
} satisfies ToolExample<LedLuminousEfficacyInput, LedLuminousEfficacyOutput>;

export const calculateLedLuminousEfficacy = (
  input: LedLuminousEfficacyInput,
): LedLuminousEfficacyOutput => {
  if (!(input.powerWatts > 0))
    simpleError(
      "powerWatts",
      "Electrical power must be positive.",
      "invalid_power",
    );
  if (!(input.luminousFluxLm >= 0))
    simpleError(
      "luminousFluxLm",
      "Luminous flux must not be negative.",
      "invalid_flux",
    );
  return { efficacyLumensPerWatt: input.luminousFluxLm / input.powerWatts };
};

export const ledLuminousEfficacyTool = createSimpleTool({
  calculate: (input) =>
    calculateLedLuminousEfficacy(input as unknown as LedLuminousEfficacyInput),
  description:
    "Compute the luminous efficacy of an LED from its luminous flux and electrical power.",
  id: "electronics/led-luminous-efficacy",
  inputs: [
    {
      description: "Total luminous flux emitted by the LED.",
      format: "flux",
      id: "luminousFluxLm",
      kind: "number",
      label: "Luminous flux",
      unit: "lm",
    },
    {
      description: "Electrical power consumed by the LED.",
      format: "power",
      id: "powerWatts",
      kind: "number",
      label: "Power",
      unit: "W",
    },
  ],
  outputs: [
    {
      description: "Luminous efficacy of the LED.",
      format: "efficacy",
      id: "efficacyLumensPerWatt",
      kind: "number",
      label: "Efficacy",
      unit: "lm/W",
    },
  ],
  title: "LED Efficacy",
});
export const runLedLuminousEfficacy = ledLuminousEfficacyTool.execute;
export default ledLuminousEfficacyTool;
