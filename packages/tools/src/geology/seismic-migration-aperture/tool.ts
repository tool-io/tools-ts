import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeismicMigrationApertureInput = {
  readonly depthM: number;
  readonly dipAngleDeg: number;
};

export type SeismicMigrationApertureOutput = {
  readonly migrationApertureM: number;
  readonly fullMigrationApertureM: number;
};

export const calculateSeismicMigrationAperture = (
  input: SeismicMigrationApertureInput,
): SeismicMigrationApertureOutput => {
  if (!(input.depthM > 0))
    return simpleError(
      "depthM",
      "Depth must be greater than zero.",
      "invalid_depth",
    );
  if (!(input.dipAngleDeg >= 0 && input.dipAngleDeg < 90))
    return simpleError(
      "dipAngleDeg",
      "Dip angle must lie in the interval from 0 up to but not including 90 degrees.",
      "invalid_angle",
    );
  const aperture = input.depthM * Math.tan((input.dipAngleDeg * Math.PI) / 180);
  return { migrationApertureM: aperture, fullMigrationApertureM: 2 * aperture };
};

export const seismicMigrationApertureExample = {
  input: { depthM: 2000, dipAngleDeg: 30 },
  output: {
    migrationApertureM: 1154.7005383792514,
    fullMigrationApertureM: 2309.4010767585028,
  },
} satisfies ToolExample<
  SeismicMigrationApertureInput,
  SeismicMigrationApertureOutput
>;

export const seismicMigrationApertureTool = createSimpleTool({
  id: "geology/seismic-migration-aperture",
  title: "Seismic Migration Aperture Calculator",
  description:
    "Horizontal migration aperture for a dipping reflector: z tan(dip) per side (and twice that for the full aperture), with reflector depth z in meters and dip angle in degrees.",
  inputs: [
    {
      description: "Reflector depth in meters.",
      id: "depthM",
      kind: "number",
      label: "z",
      minimum: 0,
    },
    {
      description: "Reflector dip angle in degrees.",
      id: "dipAngleDeg",
      kind: "number",
      label: "dip",
    },
  ],
  outputs: [
    {
      description: "One-sided horizontal migration aperture in meters.",
      id: "migrationApertureM",
      kind: "number",
      label: "Aperture",
    },
    {
      description: "Full horizontal migration aperture in meters.",
      id: "fullMigrationApertureM",
      kind: "number",
      label: "Full aperture",
    },
  ],
  calculate: (input) =>
    calculateSeismicMigrationAperture(
      input as unknown as SeismicMigrationApertureInput,
    ),
});

export const runSeismicMigrationAperture = seismicMigrationApertureTool.execute;
export default seismicMigrationApertureTool;
