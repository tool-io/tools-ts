import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PumpNpshAvailableInput = Readonly<{
  readonly suctionAbsolutePascals: number;
  readonly vaporPressurePascals: number;
  readonly densityKgPerM3: number;
  readonly gravityMetersPerSecondSquared: number;
  readonly suctionSpeedMetersPerSecond: number;
}>;
export type PumpNpshAvailableOutput = Readonly<{
  readonly npshMeters: number;
}>;

export const calculatePumpNpshAvailable = (
  x: PumpNpshAvailableInput,
): PumpNpshAvailableOutput => {
  if (
    !Number.isFinite(x.suctionAbsolutePascals) ||
    x.suctionAbsolutePascals < 0
  )
    simpleError(
      "suctionAbsolutePascals",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.vaporPressurePascals) || x.vaporPressurePascals < 0)
    simpleError("vaporPressurePascals", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared < 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.suctionSpeedMetersPerSecond) ||
    x.suctionSpeedMetersPerSecond < 0
  )
    simpleError(
      "suctionSpeedMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (x.suctionAbsolutePascals < x.vaporPressurePascals)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const npshMeters =
    (x.suctionAbsolutePascals - x.vaporPressurePascals) /
      (x.densityKgPerM3 * x.gravityMetersPerSecondSquared) +
    x.suctionSpeedMetersPerSecond ** 2 / (2 * x.gravityMetersPerSecondSquared);
  if (!Number.isFinite(npshMeters))
    simpleError(
      "npshMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { npshMeters: Object.is(npshMeters, -0) ? 0 : npshMeters };
};

export const example = {
  input: {
    suctionAbsolutePascals: 100000,
    vaporPressurePascals: 2000,
    densityKgPerM3: 1000,
    gravityMetersPerSecondSquared: 9.81,
    suctionSpeedMetersPerSecond: 2,
  },
  output: { npshMeters: 10.19367991845056 },
} satisfies ToolExample<PumpNpshAvailableInput, PumpNpshAvailableOutput>;

export const tool = createSimpleTool({
  id: "engineering/pump-npsh-available",
  title: "Pump NPSH Available",
  description:
    "Available pump NPSH from absolute suction pressure head plus velocity head minus vapor pressure head; supply losses are already reflected in suction pressure.",
  inputs: [
    {
      id: "suctionAbsolutePascals",
      kind: "number",
      label: "Suction Absolute Pascals",
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
      id: "gravityMetersPerSecondSquared",
      kind: "number",
      label: "Gravity Meters Per Second Squared",
      unit: "m/s²",
      minimum: 0,
    },
    {
      id: "suctionSpeedMetersPerSecond",
      kind: "number",
      label: "Suction Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "npshMeters", kind: "number", label: "Npsh Meters", unit: "m" },
  ],
  calculate: (input) =>
    calculatePumpNpshAvailable({
      suctionAbsolutePascals: input.suctionAbsolutePascals as number,
      vaporPressurePascals: input.vaporPressurePascals as number,
      densityKgPerM3: input.densityKgPerM3 as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
      suctionSpeedMetersPerSecond: input.suctionSpeedMetersPerSecond as number,
    }),
});
export const pumpNpshAvailableTool = tool;
export const runPumpNpshAvailable = tool.execute;
export default tool;
