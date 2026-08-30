import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RationalMethodPeakFlowInput = Readonly<{
  readonly runoffCoefficient: number;
  readonly rainfallMillimetersPerHour: number;
  readonly areaHectares: number;
}>;
export type RationalMethodPeakFlowOutput = Readonly<{
  readonly peakCubicMetersPerSecond: number;
}>;

export const calculateRationalMethodPeakFlow = (
  x: RationalMethodPeakFlowInput,
): RationalMethodPeakFlowOutput => {
  if (!Number.isFinite(x.runoffCoefficient) || x.runoffCoefficient < 0)
    simpleError("runoffCoefficient", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.rainfallMillimetersPerHour) ||
    x.rainfallMillimetersPerHour < 0
  )
    simpleError(
      "rainfallMillimetersPerHour",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.areaHectares) || x.areaHectares < 0)
    simpleError("areaHectares", "Provide a finite number at least 0.");
  if (x.runoffCoefficient > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const peakCubicMetersPerSecond =
    (x.runoffCoefficient * x.rainfallMillimetersPerHour * x.areaHectares) / 360;
  if (!Number.isFinite(peakCubicMetersPerSecond))
    simpleError(
      "peakCubicMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    peakCubicMetersPerSecond: Object.is(peakCubicMetersPerSecond, -0)
      ? 0
      : peakCubicMetersPerSecond,
  };
};

export const example = {
  input: {
    runoffCoefficient: 0.5,
    rainfallMillimetersPerHour: 50,
    areaHectares: 10,
  },
  output: { peakCubicMetersPerSecond: 0.6944444444444444 },
} satisfies ToolExample<
  RationalMethodPeakFlowInput,
  RationalMethodPeakFlowOutput
>;

export const tool = createSimpleTool({
  id: "engineering/rational-method-peak-flow",
  title: "Rational Method Peak Flow",
  description:
    "Rational-method runoff peak Q=C i A/360 in m³/s for rainfall intensity in mm/h and drainage area in hectares.",
  inputs: [
    {
      id: "runoffCoefficient",
      kind: "number",
      label: "Runoff Coefficient",
      minimum: 0,
    },
    {
      id: "rainfallMillimetersPerHour",
      kind: "number",
      label: "Rainfall Millimeters Per Hour",
      unit: "mm/h",
      minimum: 0,
    },
    {
      id: "areaHectares",
      kind: "number",
      label: "Area Hectares",
      unit: "ha",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "peakCubicMetersPerSecond",
      kind: "number",
      label: "Peak Cubic Meters Per Second",
      unit: "m³/s",
    },
  ],
  calculate: (input) =>
    calculateRationalMethodPeakFlow({
      runoffCoefficient: input.runoffCoefficient as number,
      rainfallMillimetersPerHour: input.rainfallMillimetersPerHour as number,
      areaHectares: input.areaHectares as number,
    }),
});
export const rationalMethodPeakFlowTool = tool;
export const runRationalMethodPeakFlow = tool.execute;
export default tool;
