import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThreeDIcThermalCouplingInput = {
  readonly couplingFactor?: number;
  readonly lowerTierThermalResistanceCPerW: number;
  readonly upperTierPowerWatts: number;
};

export type ThreeDIcThermalCouplingOutput = {
  readonly temperatureRiseCelsius: number;
};

export const threeDIcThermalCouplingExample = {
  input: {
    couplingFactor: 0.15,
    lowerTierThermalResistanceCPerW: 12,
    upperTierPowerWatts: 5,
  },
  output: { temperatureRiseCelsius: 9 },
} satisfies ToolExample<
  ThreeDIcThermalCouplingInput,
  ThreeDIcThermalCouplingOutput
>;

export const calculateThreeDIcThermalCoupling = (
  input: ThreeDIcThermalCouplingInput,
): ThreeDIcThermalCouplingOutput => {
  const couplingFactor = input.couplingFactor ?? 0.15;
  const lowerTierThermalResistanceCPerW = input.lowerTierThermalResistanceCPerW;
  const upperTierPowerWatts = input.upperTierPowerWatts;

  if (
    !Number.isFinite(couplingFactor) ||
    couplingFactor < 0 ||
    couplingFactor > 1
  )
    simpleError(
      "couplingFactor",
      "Coupling factor must be a finite number between 0 and 1.",
      "invalid_coupling_factor",
    );
  if (
    !Number.isFinite(lowerTierThermalResistanceCPerW) ||
    lowerTierThermalResistanceCPerW <= 0
  )
    simpleError(
      "lowerTierThermalResistanceCPerW",
      "Lower-tier thermal resistance must be a finite positive number.",
      "invalid_thermal_resistance",
    );
  if (!Number.isFinite(upperTierPowerWatts) || upperTierPowerWatts < 0)
    simpleError(
      "upperTierPowerWatts",
      "Upper-tier power must be a finite number at least 0.",
      "invalid_power",
    );

  const directRise =
    upperTierPowerWatts * couplingFactor * lowerTierThermalResistanceCPerW;
  const temperatureRiseCelsius =
    upperTierPowerWatts === 0 || couplingFactor === 0
      ? 0
      : Number.isFinite(directRise) && directRise > 0
        ? directRise
        : Math.exp(
            Math.log(upperTierPowerWatts) +
              Math.log(couplingFactor) +
              Math.log(lowerTierThermalResistanceCPerW),
          );
  if (
    !Number.isFinite(temperatureRiseCelsius) ||
    (temperatureRiseCelsius === 0 &&
      upperTierPowerWatts > 0 &&
      couplingFactor > 0)
  )
    simpleError(
      "upperTierPowerWatts",
      "Temperature rise is outside the representable positive range.",
      temperatureRiseCelsius === 0 ? "numeric_underflow" : "numeric_overflow",
    );
  return {
    temperatureRiseCelsius:
      temperatureRiseCelsius === 0 ? 0 : temperatureRiseCelsius,
  };
};

export const threeDIcThermalCouplingTool = createSimpleTool({
  calculate: (input) =>
    calculateThreeDIcThermalCoupling({
      couplingFactor: (input.couplingFactor as number | undefined) ?? undefined,
      lowerTierThermalResistanceCPerW:
        input.lowerTierThermalResistanceCPerW as number,
      upperTierPowerWatts: input.upperTierPowerWatts as number,
    }),
  description:
    "Estimate the lower-tier temperature rise in a stacked 3D-IC from upper-tier power, a thermal coupling factor, and lower-tier thermal resistance. Temperature rise = power × couplingFactor × thermalResistance.",
  id: "semiconductor/3d-ic-thermal-coupling",
  inputs: [
    {
      default: 0.15,
      description:
        "Fraction of the upper-tier thermal load that couples to the lower tier. Must be between 0 and 1; 0 yields 0 °C rise.",
      id: "couplingFactor",
      kind: "number",
      label: "Coupling factor",
      maximum: 1,
      minimum: 0,
    },
    {
      description:
        "Lower-tier thermal resistance from junction to ambient. Must be greater than 0 °C/W.",
      id: "lowerTierThermalResistanceCPerW",
      kind: "number",
      label: "Lower-tier thermal resistance",
      minimum: Number.MIN_VALUE,
      unit: "°C/W",
    },
    {
      description:
        "Total power dissipated by the upper tier. Must be at least 0 W; 0 yields 0 °C rise.",
      id: "upperTierPowerWatts",
      kind: "number",
      label: "Upper-tier power",
      minimum: 0,
      unit: "W",
    },
  ],
  outputs: [
    {
      description:
        "Estimated lower-tier temperature rise above ambient, at least 0 °C.",
      id: "temperatureRiseCelsius",
      kind: "number",
      label: "Temperature rise",
      minimum: 0,
      unit: "°C",
    },
  ],
  title: "3D-IC Thermal Coupling Calculator",
});
export const runThreeDIcThermalCoupling = threeDIcThermalCouplingTool.execute;
export default threeDIcThermalCouplingTool;
