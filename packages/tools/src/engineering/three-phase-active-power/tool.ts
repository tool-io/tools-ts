import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThreePhaseActivePowerInput = Readonly<{
  readonly lineVoltageVolts: number;
  readonly lineCurrentAmperes: number;
  readonly powerFactor: number;
}>;
export type ThreePhaseActivePowerOutput = Readonly<{
  readonly activeWatts: number;
}>;

export const calculateThreePhaseActivePower = (
  x: ThreePhaseActivePowerInput,
): ThreePhaseActivePowerOutput => {
  if (!Number.isFinite(x.lineVoltageVolts) || x.lineVoltageVolts < 0)
    simpleError("lineVoltageVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lineCurrentAmperes) || x.lineCurrentAmperes < 0)
    simpleError("lineCurrentAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.powerFactor) || x.powerFactor < 0)
    simpleError("powerFactor", "Provide a finite number at least 0.");
  if (x.powerFactor > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const activeWatts =
    Math.sqrt(3) * x.lineVoltageVolts * x.lineCurrentAmperes * x.powerFactor;
  if (!Number.isFinite(activeWatts))
    simpleError(
      "activeWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { activeWatts: Object.is(activeWatts, -0) ? 0 : activeWatts };
};

export const example = {
  input: { lineVoltageVolts: 400, lineCurrentAmperes: 10, powerFactor: 0.8 },
  output: { activeWatts: 5542.562584220407 },
} satisfies ToolExample<
  ThreePhaseActivePowerInput,
  ThreePhaseActivePowerOutput
>;

export const tool = createSimpleTool({
  id: "engineering/three-phase-active-power",
  title: "Three Phase Active Power",
  description:
    "Balanced three-phase active power √3 VLL I cosφ at line-to-line RMS voltage.",
  inputs: [
    {
      id: "lineVoltageVolts",
      kind: "number",
      label: "Line Voltage Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "lineCurrentAmperes",
      kind: "number",
      label: "Line Current Amperes",
      unit: "A",
      minimum: 0,
    },
    { id: "powerFactor", kind: "number", label: "Power Factor", minimum: 0 },
  ],
  outputs: [
    { id: "activeWatts", kind: "number", label: "Active Watts", unit: "W" },
  ],
  calculate: (input) =>
    calculateThreePhaseActivePower({
      lineVoltageVolts: input.lineVoltageVolts as number,
      lineCurrentAmperes: input.lineCurrentAmperes as number,
      powerFactor: input.powerFactor as number,
    }),
});
export const threePhaseActivePowerTool = tool;
export const runThreePhaseActivePower = tool.execute;
export default tool;
