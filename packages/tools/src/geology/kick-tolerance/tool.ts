import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KickToleranceInput = {
  readonly annularCapacityCubicMetresPerMetre: number;
  readonly casingShoeDepthMetres: number;
  readonly formationLeakOffPressurePa: number;
  readonly gravityMetresPerSecondSquared?: number;
  readonly influxDensityKgPerCubicMetre: number;
  readonly kickDepthMetres: number;
  readonly mudDensityKgPerCubicMetre: number;
  readonly porePressurePa: number;
};

export type KickToleranceOutput = {
  readonly maxAllowableSurfacePressurePa: number;
  readonly maxInfluxHeightMetres: number;
  readonly maxKickVolumeCubicMetres: number;
  readonly shutInDrillpipePressurePa: number;
};

export const calculateKickTolerance = (
  input: KickToleranceInput,
): KickToleranceOutput => {
  const gravity = input.gravityMetresPerSecondSquared ?? 9.80665;
  if (!(input.casingShoeDepthMetres > 0))
    return simpleError(
      "casingShoeDepthMetres",
      "Casing shoe depth must be greater than zero.",
      "invalid_depth",
    );
  if (!(input.kickDepthMetres >= input.casingShoeDepthMetres))
    return simpleError(
      "kickDepthMetres",
      "The kick depth must be at or below the casing shoe.",
      "invalid_depth",
    );
  if (!(input.mudDensityKgPerCubicMetre > 0))
    return simpleError(
      "mudDensityKgPerCubicMetre",
      "Mud density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.influxDensityKgPerCubicMetre > 0))
    return simpleError(
      "influxDensityKgPerCubicMetre",
      "Influx density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.mudDensityKgPerCubicMetre > input.influxDensityKgPerCubicMetre))
    return simpleError(
      "influxDensityKgPerCubicMetre",
      "Kick tolerance requires an influx lighter than the mud.",
      "invalid_density",
    );
  if (!(input.formationLeakOffPressurePa > 0))
    return simpleError(
      "formationLeakOffPressurePa",
      "Formation leak-off pressure must be greater than zero.",
      "invalid_pressure",
    );
  if (!(input.porePressurePa > 0))
    return simpleError(
      "porePressurePa",
      "Pore pressure must be greater than zero.",
      "invalid_pressure",
    );
  if (!(input.annularCapacityCubicMetresPerMetre > 0))
    return simpleError(
      "annularCapacityCubicMetresPerMetre",
      "Annular capacity must be greater than zero.",
      "invalid_capacity",
    );
  const {
    annularCapacityCubicMetresPerMetre,
    casingShoeDepthMetres,
    formationLeakOffPressurePa,
    influxDensityKgPerCubicMetre,
    kickDepthMetres,
    mudDensityKgPerCubicMetre,
    porePressurePa,
  } = input;
  const maxAllowableSurfacePressurePa =
    formationLeakOffPressurePa -
    mudDensityKgPerCubicMetre * gravity * casingShoeDepthMetres;
  if (!(maxAllowableSurfacePressurePa > 0))
    return simpleError(
      "formationLeakOffPressurePa",
      "Mud hydrostatic pressure at the shoe already exceeds the leak-off strength.",
      "no_tolerance",
    );
  const shutInDrillpipePressurePa =
    porePressurePa - mudDensityKgPerCubicMetre * gravity * kickDepthMetres;
  const maxInfluxHeightMetres =
    (maxAllowableSurfacePressurePa - shutInDrillpipePressurePa) /
    (gravity * (mudDensityKgPerCubicMetre - influxDensityKgPerCubicMetre));
  if (!(maxInfluxHeightMetres > 0))
    return simpleError(
      "porePressurePa",
      "No kick tolerance: the shut-in drillpipe pressure already exceeds the allowable surface pressure.",
      "no_tolerance",
    );
  return {
    maxAllowableSurfacePressurePa,
    shutInDrillpipePressurePa,
    maxInfluxHeightMetres,
    maxKickVolumeCubicMetres:
      maxInfluxHeightMetres * annularCapacityCubicMetresPerMetre,
  };
};

export const kickToleranceExample = {
  input: {
    annularCapacityCubicMetresPerMetre: 0.03,
    casingShoeDepthMetres: 2000,
    formationLeakOffPressurePa: 40000000,
    influxDensityKgPerCubicMetre: 250,
    kickDepthMetres: 3000,
    mudDensityKgPerCubicMetre: 1250,
    porePressurePa: 45000000,
  },
  output: {
    maxAllowableSurfacePressurePa: 15483375,
    shutInDrillpipePressurePa: 8225062.5,
    maxInfluxHeightMetres: 740.141893511036,
    maxKickVolumeCubicMetres: 22.204256805331077,
  },
} satisfies ToolExample<KickToleranceInput, KickToleranceOutput>;

export const kickToleranceTool = createSimpleTool({
  id: "geology/kick-tolerance",
  title: "Kick Tolerance Calculator",
  description:
    "Compute the maximum kick volume that can be shut in without fracturing the formation at the casing shoe.",
  inputs: [
    {
      description:
        "Open-hole annular capacity below the shoe in cubic metres per metre.",
      id: "annularCapacityCubicMetresPerMetre",
      kind: "number",
      label: "Annular capacity",
    },
    {
      description: "True vertical depth of the casing shoe in metres.",
      id: "casingShoeDepthMetres",
      kind: "number",
      label: "Shoe TVD",
    },
    {
      description: "Surface leak-off pressure recorded at the shoe in pascals.",
      id: "formationLeakOffPressurePa",
      kind: "number",
      label: "Leak-off pressure",
    },
    {
      description: "True vertical depth where the kick is taken in metres.",
      id: "kickDepthMetres",
      kind: "number",
      label: "Kick TVD",
    },
    {
      description:
        "Density of the invading fluid in kilograms per cubic metre.",
      id: "influxDensityKgPerCubicMetre",
      kind: "number",
      label: "Influx density",
    },
    {
      description:
        "Density of the mud in the hole in kilograms per cubic metre.",
      id: "mudDensityKgPerCubicMetre",
      kind: "number",
      label: "Mud density",
    },
    {
      description: "Pore pressure at the kick depth in pascals.",
      id: "porePressurePa",
      kind: "number",
      label: "Pore pressure",
    },
    {
      default: 9.80665,
      description: "Gravitational acceleration in metres per second squared.",
      id: "gravityMetresPerSecondSquared",
      kind: "number",
      label: "Gravity",
    },
  ],
  outputs: [
    {
      description:
        "Maximum allowable annular surface pressure in pascals (MAASP).",
      id: "maxAllowableSurfacePressurePa",
      kind: "number",
      label: "MAASP",
    },
    {
      description: "Shut-in drillpipe pressure in pascals (SIDPP).",
      id: "shutInDrillpipePressurePa",
      kind: "number",
      label: "SIDPP",
    },
    {
      description: "Maximum tolerable influx column height in metres.",
      id: "maxInfluxHeightMetres",
      kind: "number",
      label: "Max influx height",
    },
    {
      description: "Maximum tolerable kick volume in cubic metres.",
      id: "maxKickVolumeCubicMetres",
      kind: "number",
      label: "Kick tolerance",
    },
  ],
  calculate: (input) =>
    calculateKickTolerance(input as unknown as KickToleranceInput),
});

export const runKickTolerance = kickToleranceTool.execute;
export default kickToleranceTool;
