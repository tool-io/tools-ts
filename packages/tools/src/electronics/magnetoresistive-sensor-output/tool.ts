import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagnetoresistiveSensorOutputInput = Readonly<{
  readonly supplyVolts: number;
  readonly baselineOhms: number;
  readonly resistanceChangeOhms: number;
}>;
export type MagnetoresistiveSensorOutputOutput = Readonly<{
  readonly outputChangeVolts: number;
}>;

export const calculateMagnetoresistiveSensorOutput = (
  x: MagnetoresistiveSensorOutputInput,
): MagnetoresistiveSensorOutputOutput => {
  if (!Number.isFinite(x.supplyVolts) || x.supplyVolts < 0)
    simpleError("supplyVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.baselineOhms) || x.baselineOhms < 0)
    simpleError("baselineOhms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.resistanceChangeOhms))
    simpleError("resistanceChangeOhms", "Provide a finite number.");
  if (x.resistanceChangeOhms <= -x.baselineOhms)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const outputChangeVolts =
    (x.supplyVolts * x.baselineOhms) /
      (2 * x.baselineOhms + x.resistanceChangeOhms) -
    x.supplyVolts / 2;
  if (!Number.isFinite(outputChangeVolts))
    simpleError(
      "outputChangeVolts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    outputChangeVolts: Object.is(outputChangeVolts, -0) ? 0 : outputChangeVolts,
  };
};

export const example = {
  input: { supplyVolts: 5, baselineOhms: 100, resistanceChangeOhms: 10 },
  output: { outputChangeVolts: -0.11904761904761907 },
} satisfies ToolExample<
  MagnetoresistiveSensorOutputInput,
  MagnetoresistiveSensorOutputOutput
>;

export const tool = createSimpleTool({
  id: "electronics/magnetoresistive-sensor-output",
  title: "Magnetoresistive Sensor Output",
  description:
    "Change in divider output voltage when the upper magnetoresistive element changes by ΔR while an equal fixed resistor remains below it.",
  inputs: [
    {
      id: "supplyVolts",
      kind: "number",
      label: "Supply Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "baselineOhms",
      kind: "number",
      label: "Baseline Ohms",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "resistanceChangeOhms",
      kind: "number",
      label: "Resistance Change Ohms",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      id: "outputChangeVolts",
      kind: "number",
      label: "Output Change Volts",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateMagnetoresistiveSensorOutput({
      supplyVolts: input.supplyVolts as number,
      baselineOhms: input.baselineOhms as number,
      resistanceChangeOhms: input.resistanceChangeOhms as number,
    }),
});
export const magnetoresistiveSensorOutputTool = tool;
export const runMagnetoresistiveSensorOutput = tool.execute;
export default tool;
