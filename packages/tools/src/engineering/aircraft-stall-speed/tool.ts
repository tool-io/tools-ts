import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AircraftStallSpeedInput = Readonly<{
  readonly weightNewtons: number;
  readonly densityKgPerM3: number;
  readonly wingAreaSquareMeters: number;
  readonly maximumLiftCoefficient: number;
}>;
export type AircraftStallSpeedOutput = Readonly<{
  readonly stallMetersPerSecond: number;
}>;

export const calculateAircraftStallSpeed = (
  x: AircraftStallSpeedInput,
): AircraftStallSpeedOutput => {
  if (!Number.isFinite(x.weightNewtons) || x.weightNewtons < 0)
    simpleError("weightNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wingAreaSquareMeters) || x.wingAreaSquareMeters < 0)
    simpleError("wingAreaSquareMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.maximumLiftCoefficient) ||
    x.maximumLiftCoefficient < 0
  )
    simpleError(
      "maximumLiftCoefficient",
      "Provide a finite number at least 0.",
    );
  const stallMetersPerSecond = Math.sqrt(
    (2 * x.weightNewtons) /
      (x.densityKgPerM3 * x.wingAreaSquareMeters * x.maximumLiftCoefficient),
  );
  if (!Number.isFinite(stallMetersPerSecond))
    simpleError(
      "stallMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    stallMetersPerSecond: Object.is(stallMetersPerSecond, -0)
      ? 0
      : stallMetersPerSecond,
  };
};

export const example = {
  input: {
    weightNewtons: 10000,
    densityKgPerM3: 1.225,
    wingAreaSquareMeters: 20,
    maximumLiftCoefficient: 1.5,
  },
  output: { stallMetersPerSecond: 23.32847374079217 },
} satisfies ToolExample<AircraftStallSpeedInput, AircraftStallSpeedOutput>;

export const tool = createSimpleTool({
  id: "engineering/aircraft-stall-speed",
  title: "Aircraft Stall Speed",
  description:
    "Level-flight stall speed from aircraft weight, air density, wing area and maximum lift coefficient: Vs=√[2W/(ρSClmax)].",
  inputs: [
    {
      id: "weightNewtons",
      kind: "number",
      label: "Weight Newtons",
      unit: "N",
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
      id: "wingAreaSquareMeters",
      kind: "number",
      label: "Wing Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "maximumLiftCoefficient",
      kind: "number",
      label: "Maximum Lift Coefficient",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stallMetersPerSecond",
      kind: "number",
      label: "Stall Meters Per Second",
      unit: "m/s",
    },
  ],
  calculate: (input) =>
    calculateAircraftStallSpeed({
      weightNewtons: input.weightNewtons as number,
      densityKgPerM3: input.densityKgPerM3 as number,
      wingAreaSquareMeters: input.wingAreaSquareMeters as number,
      maximumLiftCoefficient: input.maximumLiftCoefficient as number,
    }),
});
export const aircraftStallSpeedTool = tool;
export const runAircraftStallSpeed = tool.execute;
export default tool;
