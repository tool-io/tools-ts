import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SparkGapBreakdownVoltageInput = Readonly<{
  readonly breakdownFieldVoltsPerMeter: number;
  readonly gapMeters: number;
}>;
export type SparkGapBreakdownVoltageOutput = Readonly<{
  breakdownVoltageV: number;
}>;

export const calculateSparkGapBreakdownVoltage = (
  i: SparkGapBreakdownVoltageInput,
): SparkGapBreakdownVoltageOutput => {
  const value = i.breakdownFieldVoltsPerMeter * i.gapMeters;
  if (!Number.isFinite(value))
    simpleError("breakdownVoltageV", "The inputs produce a non-finite result.");
  return { breakdownVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { breakdownFieldVoltsPerMeter: 3000000, gapMeters: 0.001 },
  output: { breakdownVoltageV: 3000 },
} satisfies ToolExample<
  SparkGapBreakdownVoltageInput,
  SparkGapBreakdownVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/spark-gap-breakdown-voltage",
  title: "Spark Gap Breakdown Voltage",
  description:
    "Estimate uniform-field gas-gap breakdown voltage as assumed breakdown electric field times electrode separation; real gaps require pressure and geometry data.",
  inputs: [
    {
      id: "breakdownFieldVoltsPerMeter",
      kind: "number",
      label: "Breakdown Field (V/m)",
      unit: "V/m",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "gapMeters",
      kind: "number",
      label: "Gap (m)",
      unit: "m",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "breakdownVoltageV",
      kind: "number",
      label: "Breakdown (V)",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateSparkGapBreakdownVoltage({
      breakdownFieldVoltsPerMeter: input.breakdownFieldVoltsPerMeter as number,
      gapMeters: input.gapMeters as number,
    }),
});
export const sparkGapBreakdownVoltageTool = tool;
export const runSparkGapBreakdownVoltage = tool.execute;
export default tool;
