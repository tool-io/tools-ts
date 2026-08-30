import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PropellerEfficiencyInput = Readonly<{
  readonly thrustNewtons: number;
  readonly advanceSpeedMetersPerSecond: number;
  readonly shaftPowerWatts: number;
}>;
export type PropellerEfficiencyOutput = Readonly<{
  readonly efficiencyPercent: number;
}>;

export const calculatePropellerEfficiency = (
  x: PropellerEfficiencyInput,
): PropellerEfficiencyOutput => {
  if (!Number.isFinite(x.thrustNewtons) || x.thrustNewtons < 0)
    simpleError("thrustNewtons", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.advanceSpeedMetersPerSecond) ||
    x.advanceSpeedMetersPerSecond < 0
  )
    simpleError(
      "advanceSpeedMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.shaftPowerWatts) || x.shaftPowerWatts < 0)
    simpleError("shaftPowerWatts", "Provide a finite number at least 0.");
  if (x.thrustNewtons * x.advanceSpeedMetersPerSecond > x.shaftPowerWatts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const efficiencyPercent =
    (100 * x.thrustNewtons * x.advanceSpeedMetersPerSecond) / x.shaftPowerWatts;
  if (!Number.isFinite(efficiencyPercent))
    simpleError(
      "efficiencyPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    efficiencyPercent: Object.is(efficiencyPercent, -0) ? 0 : efficiencyPercent,
  };
};

export const example = {
  input: {
    thrustNewtons: 1000,
    advanceSpeedMetersPerSecond: 10,
    shaftPowerWatts: 20000,
  },
  output: { efficiencyPercent: 50 },
} satisfies ToolExample<PropellerEfficiencyInput, PropellerEfficiencyOutput>;

export const tool = createSimpleTool({
  id: "engineering/propeller-efficiency",
  title: "Propeller Efficiency",
  description:
    "Propulsive efficiency as thrust times advance speed divided by shaft power; assumes steady straight-ahead motion.",
  inputs: [
    {
      id: "thrustNewtons",
      kind: "number",
      label: "Thrust Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "advanceSpeedMetersPerSecond",
      kind: "number",
      label: "Advance Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "shaftPowerWatts",
      kind: "number",
      label: "Shaft Power Watts",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculatePropellerEfficiency({
      thrustNewtons: input.thrustNewtons as number,
      advanceSpeedMetersPerSecond: input.advanceSpeedMetersPerSecond as number,
      shaftPowerWatts: input.shaftPowerWatts as number,
    }),
});
export const propellerEfficiencyTool = tool;
export const runPropellerEfficiency = tool.execute;
export default tool;
