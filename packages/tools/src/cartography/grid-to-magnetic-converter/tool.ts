import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GridToMagneticConverterInput = Readonly<{
  readonly gridAzimuthDegrees: number;
  readonly convergenceDegrees: number;
  readonly declinationDegrees: number;
}>;
export type GridToMagneticConverterOutput = Readonly<{
  readonly magneticAzimuthDegrees: number;
}>;

export const calculateGridToMagneticConverter = (
  x: GridToMagneticConverterInput,
): GridToMagneticConverterOutput => {
  if (!Number.isFinite(x.gridAzimuthDegrees) || x.gridAzimuthDegrees < 0)
    simpleError("gridAzimuthDegrees", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.convergenceDegrees))
    simpleError("convergenceDegrees", "Provide a finite number.");
  if (!Number.isFinite(x.declinationDegrees))
    simpleError("declinationDegrees", "Provide a finite number.");
  if (!(x.gridAzimuthDegrees < 360))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const magneticAzimuthDegrees =
    (((x.gridAzimuthDegrees + x.convergenceDegrees - x.declinationDegrees) %
      360) +
      360) %
    360;
  if (!Number.isFinite(magneticAzimuthDegrees))
    simpleError(
      "magneticAzimuthDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    magneticAzimuthDegrees: Object.is(magneticAzimuthDegrees, -0)
      ? 0
      : magneticAzimuthDegrees,
  };
};

export const example = {
  input: {
    gridAzimuthDegrees: 30,
    convergenceDegrees: 2,
    declinationDegrees: 5,
  },
  output: { magneticAzimuthDegrees: 27 },
} satisfies ToolExample<
  GridToMagneticConverterInput,
  GridToMagneticConverterOutput
>;

export const tool = createSimpleTool({
  id: "cartography/grid-to-magnetic-converter",
  title: "Grid To Magnetic Converter",
  description:
    "Magnetic azimuth from grid azimuth, signed grid convergence (true minus grid), and east-positive declination.",
  inputs: [
    {
      id: "gridAzimuthDegrees",
      kind: "number",
      label: "Grid Azimuth Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "convergenceDegrees",
      kind: "number",
      label: "Convergence Degrees",
      unit: "deg",
    },
    {
      id: "declinationDegrees",
      kind: "number",
      label: "Declination Degrees",
      unit: "deg",
    },
  ],
  outputs: [
    {
      id: "magneticAzimuthDegrees",
      kind: "number",
      label: "Magnetic Azimuth Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateGridToMagneticConverter({
      gridAzimuthDegrees: input.gridAzimuthDegrees as number,
      convergenceDegrees: input.convergenceDegrees as number,
      declinationDegrees: input.declinationDegrees as number,
    }),
});
export const gridToMagneticConverterTool = tool;
export const runGridToMagneticConverter = tool.execute;
export default tool;
