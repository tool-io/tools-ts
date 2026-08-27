import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WellheadPressureShutInInput = {
  readonly bottomholePressureMegapascals: number;
  readonly fluidDensityKilogramsPerCubicMetre: number;
  readonly trueVerticalDepthMetres: number;
  readonly gravitationalAccelerationMetresPerSecondSquared?: number;
};

export type WellheadPressureShutInOutput = {
  readonly hydrostaticColumnPressureMegapascals: number;
  readonly shutInWellheadPressureMegapascals: number;
};

export const calculateWellheadPressureShutIn = (
  input: WellheadPressureShutInInput,
): WellheadPressureShutInOutput => {
  const gravity =
    input.gravitationalAccelerationMetresPerSecondSquared ?? 9.80665;
  if (!(input.bottomholePressureMegapascals >= 0))
    return simpleError(
      "bottomholePressureMegapascals",
      "Bottom-hole pressure cannot be negative.",
      "invalid_pressure",
    );
  if (!(input.fluidDensityKilogramsPerCubicMetre > 0))
    return simpleError(
      "fluidDensityKilogramsPerCubicMetre",
      "Fluid density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.trueVerticalDepthMetres > 0))
    return simpleError(
      "trueVerticalDepthMetres",
      "True vertical depth must be greater than zero.",
      "invalid_depth",
    );
  if (!(gravity > 0))
    return simpleError(
      "gravitationalAccelerationMetresPerSecondSquared",
      "Gravitational acceleration must be greater than zero.",
      "invalid_gravity",
    );
  const hydrostatic =
    (input.fluidDensityKilogramsPerCubicMetre *
      gravity *
      input.trueVerticalDepthMetres) /
    1e6;
  if (!(input.bottomholePressureMegapascals >= hydrostatic))
    return simpleError(
      "bottomholePressureMegapascals",
      "Bottom-hole pressure is lower than the hydrostatic column pressure.",
      "invalid_pressure",
    );
  return {
    hydrostaticColumnPressureMegapascals: hydrostatic,
    shutInWellheadPressureMegapascals:
      input.bottomholePressureMegapascals - hydrostatic,
  };
};

export const wellheadPressureShutInExample = {
  input: {
    bottomholePressureMegapascals: 34.5,
    fluidDensityKilogramsPerCubicMetre: 1100,
    trueVerticalDepthMetres: 2800,
  },
  output: {
    hydrostaticColumnPressureMegapascals: 30.204481999999995,
    shutInWellheadPressureMegapascals: 4.295518000000005,
  },
} satisfies ToolExample<
  WellheadPressureShutInInput,
  WellheadPressureShutInOutput
>;

export const wellheadPressureShutInTool = createSimpleTool({
  id: "geology/wellhead-pressure-shut-in",
  title: "Wellhead Pressure Shut In Calculator",
  description:
    "Compute the shut-in wellhead (tubing head) pressure by subtracting the static hydrostatic column from the shut-in bottom-hole pressure.",
  inputs: [
    {
      description: "Shut-in bottom-hole pressure in megapascals.",
      id: "bottomholePressureMegapascals",
      kind: "number",
      label: "BHP",
    },
    {
      description: "Fluid density in the tubing in kilograms per cubic metre.",
      id: "fluidDensityKilogramsPerCubicMetre",
      kind: "number",
      label: "Fluid density",
    },
    {
      description: "True vertical depth of the fluid column in metres.",
      id: "trueVerticalDepthMetres",
      kind: "number",
      label: "TVD",
    },
    {
      default: 9.80665,
      description: "Gravitational acceleration in metres per second squared.",
      id: "gravitationalAccelerationMetresPerSecondSquared",
      kind: "number",
      label: "Gravity",
    },
  ],
  outputs: [
    {
      description:
        "Hydrostatic pressure of the vertical fluid column in megapascals.",
      id: "hydrostaticColumnPressureMegapascals",
      kind: "number",
      label: "Hydrostatic",
    },
    {
      description: "Shut-in wellhead pressure in megapascals.",
      id: "shutInWellheadPressureMegapascals",
      kind: "number",
      label: "SIWHP",
    },
  ],
  calculate: (input) =>
    calculateWellheadPressureShutIn(
      input as unknown as WellheadPressureShutInInput,
    ),
});

export const runWellheadPressureShutIn = wellheadPressureShutInTool.execute;
export default wellheadPressureShutInTool;
