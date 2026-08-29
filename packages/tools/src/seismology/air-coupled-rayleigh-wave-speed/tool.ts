import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const airCoupledRayleighWaveSpeedExample = {
  input: { shearVelocityKmS: 3.5 },
  output: { rayleighSpeedKmS: 3.22, supersonicVsAir: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const airCoupledRayleighWaveSpeedTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ shearVelocityKmS, rayleighCoefficient }) => {
      if (shearVelocityKmS <= 0)
        simpleError(
          "shearVelocityKmS",
          "Shear-wave velocity must be positive.",
        );
      if (rayleighCoefficient <= 0 || rayleighCoefficient >= 1)
        simpleError(
          "rayleighCoefficient",
          "The Rayleigh-to-shear speed ratio must be between zero and one.",
        );
      const rayleighSpeedKmS = shearVelocityKmS * rayleighCoefficient;
      return { rayleighSpeedKmS, supersonicVsAir: rayleighSpeedKmS > 0.343 };
    })(input as never) as Record<string, unknown>,
  description:
    "Rayleigh wave speed from shear velocity (≈0.92·β for ν = 0.25) compared with the speed of sound in air.",
  id: "seismology/air-coupled-rayleigh-wave-speed",
  inputs: [
    {
      minimum: 0,
      description: "Shear wave velocity.",
      id: "shearVelocityKmS",
      kind: "number",
      label: "β",
      unit: "km/s",
    },
    {
      default: 0.92,
      minimum: 0,
      maximum: 1,
      description: "Rayleigh-to-shear coefficient.",
      id: "rayleighCoefficient",
      kind: "number",
      label: "c_R/β",
    },
  ],
  outputs: [
    {
      description: "Rayleigh wave speed.",
      id: "rayleighSpeedKmS",
      kind: "number",
      label: "c_R",
      unit: "km/s",
    },
    {
      description: "Whether c_R exceeds the ~0.343 km/s air sound speed.",
      id: "supersonicVsAir",
      kind: "boolean",
      label: "Supersonic",
    },
  ],
  title: "Air Coupled Rayleigh Wave Speed Calculator",
});
export const runAirCoupledRayleighWaveSpeed =
  airCoupledRayleighWaveSpeedTool.execute;
export { airCoupledRayleighWaveSpeedExample as example };
export default airCoupledRayleighWaveSpeedTool;
