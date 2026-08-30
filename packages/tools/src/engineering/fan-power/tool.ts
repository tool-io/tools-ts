import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FanPowerInput = Readonly<{
  readonly flowCubicMetersPerSecond: number;
  readonly pressureRisePascals: number;
  readonly efficiency: number;
}>;
export type FanPowerOutput = Readonly<{
  readonly shaftPowerWatts: number;
}>;

export const calculateFanPower = (x: FanPowerInput): FanPowerOutput => {
  if (
    !Number.isFinite(x.flowCubicMetersPerSecond) ||
    x.flowCubicMetersPerSecond < 0
  )
    simpleError(
      "flowCubicMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.pressureRisePascals) || x.pressureRisePascals < 0)
    simpleError("pressureRisePascals", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.efficiency) || x.efficiency < 0)
    simpleError("efficiency", "Provide a finite number at least 0.");
  if (x.efficiency > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const shaftPowerWatts =
    (x.flowCubicMetersPerSecond * x.pressureRisePascals) / x.efficiency;
  if (!Number.isFinite(shaftPowerWatts))
    simpleError(
      "shaftPowerWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    shaftPowerWatts: Object.is(shaftPowerWatts, -0) ? 0 : shaftPowerWatts,
  };
};

export const example = {
  input: {
    flowCubicMetersPerSecond: 1,
    pressureRisePascals: 500,
    efficiency: 0.5,
  },
  output: { shaftPowerWatts: 1000 },
} satisfies ToolExample<FanPowerInput, FanPowerOutput>;

export const tool = createSimpleTool({
  id: "engineering/fan-power",
  title: "Fan Power",
  description:
    "Ideal fan shaft power from volumetric airflow times pressure rise divided by overall fan efficiency.",
  inputs: [
    {
      id: "flowCubicMetersPerSecond",
      kind: "number",
      label: "Flow Cubic Meters Per Second",
      unit: "m³/s",
      minimum: 0,
    },
    {
      id: "pressureRisePascals",
      kind: "number",
      label: "Pressure Rise Pascals",
      unit: "Pa",
      minimum: 0,
    },
    { id: "efficiency", kind: "number", label: "Efficiency", minimum: 0 },
  ],
  outputs: [
    {
      id: "shaftPowerWatts",
      kind: "number",
      label: "Shaft Power Watts",
      unit: "W",
    },
  ],
  calculate: (input) =>
    calculateFanPower({
      flowCubicMetersPerSecond: input.flowCubicMetersPerSecond as number,
      pressureRisePascals: input.pressureRisePascals as number,
      efficiency: input.efficiency as number,
    }),
});
export const fanPowerTool = tool;
export const runFanPower = tool.execute;
export default tool;
