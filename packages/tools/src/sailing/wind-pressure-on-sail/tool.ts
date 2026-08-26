import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindPressureOnSailInput = {
  readonly liftCoefficient: number;
  readonly sailAreaM2: number;
  readonly windSpeedMs: number;
};

export type WindPressureOnSailOutput = {
  readonly sailForceNewtons: number;
};

const AIR_DENSITY_KG_PER_M3 = 1.225;

export const windPressureOnSailExample = {
  input: { liftCoefficient: 1, sailAreaM2: 20, windSpeedMs: 10 },
  output: { sailForceNewtons: 1225.0000000000002 },
} satisfies ToolExample<WindPressureOnSailInput, WindPressureOnSailOutput>;

export const calculateWindPressureOnSail = (
  input: WindPressureOnSailInput,
): WindPressureOnSailOutput => {
  if (input.windSpeedMs <= 0)
    simpleError(
      "windSpeedMs",
      "The wind speed must be positive.",
      "invalid_wind",
    );
  if (input.sailAreaM2 <= 0)
    simpleError(
      "sailAreaM2",
      "The sail area must be positive.",
      "invalid_area",
    );
  return {
    sailForceNewtons:
      0.5 *
      AIR_DENSITY_KG_PER_M3 *
      Math.pow(input.windSpeedMs, 2) *
      input.sailAreaM2 *
      input.liftCoefficient,
  };
};

export const windPressureOnSailTool = createSimpleTool({
  calculate: (input) =>
    calculateWindPressureOnSail(input as unknown as WindPressureOnSailInput),
  description:
    "Compute aerodynamic force on a sail from dynamic pressure using 0.5 times air density times wind speed squared times sail area times lift coefficient.",
  id: "sailing/wind-pressure-on-sail",
  inputs: [
    {
      description: "Lift coefficient of the sail planform.",
      id: "liftCoefficient",
      kind: "number",
      label: "Lift coefficient",
      default: 1.0,
      maximum: 2,
      minimum: 0,
    },
    {
      description: "Total sail area exposed to the wind.",
      id: "sailAreaM2",
      kind: "number",
      label: "Sail area",
      minimum: 0,
      unit: "m2",
    },
    {
      description: "Apparent wind speed across the sail.",
      id: "windSpeedMs",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Force exerted on the sail by the wind.",
      format: "force",
      id: "sailForceNewtons",
      kind: "number",
      label: "Sail force",
      unit: "N",
    },
  ],
  title: "Wind Pressure on Sail Calculator",
});
export const runWindPressureOnSail = windPressureOnSailTool.execute;
export default windPressureOnSailTool;
