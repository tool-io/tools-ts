import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolarCellMaxPowerInput = Readonly<{
  readonly openCircuitVoltageV: number;
  readonly shortCircuitCurrentA: number;
  readonly fillFactor: number;
}>;
export type SolarCellMaxPowerOutput = Readonly<{ maximumPowerW: number }>;

export const calculateSolarCellMaxPower = (
  input: SolarCellMaxPowerInput,
): SolarCellMaxPowerOutput => {
  if (!(
    Number.isFinite(input.openCircuitVoltageV) && input.openCircuitVoltageV >= 0
  ))
    simpleError(
      "openCircuitVoltageV",
      "Open-circuit voltage must be finite and nonnegative.",
    );
  if (!(
    Number.isFinite(input.shortCircuitCurrentA) &&
    input.shortCircuitCurrentA >= 0
  ))
    simpleError(
      "shortCircuitCurrentA",
      "Short-circuit current must be finite and nonnegative.",
    );
  if (!(
    Number.isFinite(input.fillFactor) &&
    input.fillFactor >= 0 &&
    input.fillFactor <= 1
  ))
    simpleError("fillFactor", "Fill factor must lie between zero and one.");
  const maximumPowerW =
    input.openCircuitVoltageV * (input.shortCircuitCurrentA * input.fillFactor);
  if (!Number.isFinite(maximumPowerW))
    simpleError("maximumPowerW", "The inputs produce a non-finite power.");
  return { maximumPowerW };
};

export const example = {
  input: { openCircuitVoltageV: 0.6, shortCircuitCurrentA: 5, fillFactor: 0.8 },
  output: { maximumPowerW: 2.4 },
} satisfies ToolExample<SolarCellMaxPowerInput, SolarCellMaxPowerOutput>;

export const tool = createSimpleTool({
  id: "electronics/solar-cell-max-power",
  title: "Solar Cell Maximum Power",
  description:
    "Estimate a solar cell's maximum-power-point output from open-circuit voltage, short-circuit current, and measured fill factor at the same conditions.",
  inputs: [
    {
      id: "openCircuitVoltageV",
      kind: "number",
      label: "Open-circuit voltage",
      unit: "V",
      minimum: 0,
    },
    {
      id: "shortCircuitCurrentA",
      kind: "number",
      label: "Short-circuit current",
      unit: "A",
      minimum: 0,
    },
    {
      id: "fillFactor",
      kind: "number",
      label: "Fill factor",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "maximumPowerW", kind: "number", label: "Maximum power", unit: "W" },
  ],
  calculate: (input) =>
    calculateSolarCellMaxPower({
      openCircuitVoltageV: input.openCircuitVoltageV as number,
      shortCircuitCurrentA: input.shortCircuitCurrentA as number,
      fillFactor: input.fillFactor as number,
    }),
});
export const solarCellMaxPowerTool = tool;
export const runSolarCellMaxPower = tool.execute;
export default tool;
