import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CavitationNumberInput = Readonly<{
  readonly absolutePressurePascals: number;
  readonly vaporPressurePascals: number;
  readonly densityKgPerM3: number;
  readonly speedMetersPerSecond: number;
}>;
export type CavitationNumberOutput = Readonly<{
  readonly cavitationNumber: number;
}>;

export const calculateCavitationNumber = (
  x: CavitationNumberInput,
): CavitationNumberOutput => {
  if (
    !Number.isFinite(x.absolutePressurePascals) ||
    x.absolutePressurePascals < 0
  )
    simpleError(
      "absolutePressurePascals",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.vaporPressurePascals) || x.vaporPressurePascals < 0)
    simpleError("vaporPressurePascals", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (x.absolutePressurePascals < x.vaporPressurePascals)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const cavitationNumber =
    (x.absolutePressurePascals - x.vaporPressurePascals) /
    (0.5 * x.densityKgPerM3 * x.speedMetersPerSecond ** 2);
  if (!Number.isFinite(cavitationNumber))
    simpleError(
      "cavitationNumber",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    cavitationNumber: Object.is(cavitationNumber, -0) ? 0 : cavitationNumber,
  };
};

export const example = {
  input: {
    absolutePressurePascals: 101325,
    vaporPressurePascals: 2300,
    densityKgPerM3: 1000,
    speedMetersPerSecond: 5,
  },
  output: { cavitationNumber: 7.922 },
} satisfies ToolExample<CavitationNumberInput, CavitationNumberOutput>;

export const tool = createSimpleTool({
  id: "engineering/cavitation-number",
  title: "Cavitation Number",
  description:
    "Cavitation number (p−pv)/(½ρv²) using local absolute pressure and vapor pressure.",
  inputs: [
    {
      id: "absolutePressurePascals",
      kind: "number",
      label: "Absolute Pressure Pascals",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "vaporPressurePascals",
      kind: "number",
      label: "Vapor Pressure Pascals",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "cavitationNumber", kind: "number", label: "Cavitation Number" },
  ],
  calculate: (input) =>
    calculateCavitationNumber({
      absolutePressurePascals: input.absolutePressurePascals as number,
      vaporPressurePascals: input.vaporPressurePascals as number,
      densityKgPerM3: input.densityKgPerM3 as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
    }),
});
export const cavitationNumberTool = tool;
export const runCavitationNumber = tool.execute;
export default tool;
