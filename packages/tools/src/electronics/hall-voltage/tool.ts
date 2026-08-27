import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const ELEMENTARY_CHARGE = 1.602176634e-19;

export type HallVoltageInput = {
  readonly currentAmps: number;
  readonly fluxDensityTesla: number;
  readonly chargeCarrierDensityPerM3: number;
  readonly thicknessMeters: number;
};

export type HallVoltageOutput = {
  readonly hallVoltageV: number;
};

export const hallVoltageExample = {
  input: {
    currentAmps: 1,
    fluxDensityTesla: 1,
    chargeCarrierDensityPerM3: 1e28,
    thicknessMeters: 0.001,
  },
  output: { hallVoltageV: 6.241509074460763e-7 },
} satisfies ToolExample<HallVoltageInput, HallVoltageOutput>;

export const hallVoltageTool = createSimpleTool({
  id: "electronics/hall-voltage",
  title: "Hall Voltage",
  description:
    "Compute Hall voltage as (I x B) / (n x e x t) with e the elementary charge.",
  inputs: [
    { id: "currentAmps", label: "Current", kind: "number", unit: "A" },
    {
      id: "fluxDensityTesla",
      label: "Flux density",
      kind: "number",
      unit: "T",
    },
    {
      id: "chargeCarrierDensityPerM3",
      label: "Carrier density",
      kind: "number",
      unit: "m⁻³",
    },
    { id: "thicknessMeters", label: "Thickness", kind: "number", unit: "m" },
  ],
  outputs: [
    { id: "hallVoltageV", label: "Hall voltage", kind: "number", unit: "V" },
  ],
  calculate: (input) => {
    const currentAmps = input.currentAmps as number;
    const fluxDensityTesla = input.fluxDensityTesla as number;
    const chargeCarrierDensityPerM3 = input.chargeCarrierDensityPerM3 as number;
    const thicknessMeters = input.thicknessMeters as number;
    if (!(currentAmps > 0))
      simpleError(
        "currentAmps",
        "Current must be positive.",
        "invalid_current",
      );
    if (!(fluxDensityTesla >= 0))
      simpleError(
        "fluxDensityTesla",
        "Flux density must not be negative.",
        "invalid_flux_density",
      );
    if (!(chargeCarrierDensityPerM3 > 0))
      simpleError(
        "chargeCarrierDensityPerM3",
        "Carrier density must be positive.",
        "invalid_density",
      );
    if (!(thicknessMeters > 0))
      simpleError(
        "thicknessMeters",
        "Thickness must be positive.",
        "invalid_thickness",
      );
    return {
      hallVoltageV:
        (currentAmps * fluxDensityTesla) /
        (chargeCarrierDensityPerM3 * ELEMENTARY_CHARGE * thicknessMeters),
    };
  },
});
export const runHallVoltage = hallVoltageTool.execute;
export default hallVoltageTool;
