import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LvdtOutputVoltageInput = Readonly<{
  readonly sensitivityVoltsPerMm: number;
  readonly displacementMm: number;
}>;
export type LvdtOutputVoltageOutput = Readonly<{ outputVoltageV: number }>;

export const calculateLvdtOutputVoltage = (
  i: LvdtOutputVoltageInput,
): LvdtOutputVoltageOutput => {
  const value = i.sensitivityVoltsPerMm * i.displacementMm;
  if (!Number.isFinite(value))
    simpleError("outputVoltageV", "The inputs produce a non-finite result.");
  return { outputVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { sensitivityVoltsPerMm: 0.2, displacementMm: 5 },
  output: { outputVoltageV: 1 },
} satisfies ToolExample<LvdtOutputVoltageInput, LvdtOutputVoltageOutput>;

export const tool = createSimpleTool({
  id: "electronics/lvdt-output-voltage",
  title: "LVDT Output Voltage",
  description:
    "Calculate linear-region LVDT output voltage from calibrated sensitivity in volts per millimeter and signed core displacement; excitation and demodulation are assumed fixed.",
  inputs: [
    {
      id: "sensitivityVoltsPerMm",
      kind: "number",
      label: "Sensitivity (V/mm)",
      unit: "V/mm",
    },
    {
      id: "displacementMm",
      kind: "number",
      label: "Displacement (mm)",
      unit: "mm",
    },
  ],
  outputs: [
    { id: "outputVoltageV", kind: "number", label: "Output (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculateLvdtOutputVoltage({
      sensitivityVoltsPerMm: input.sensitivityVoltsPerMm as number,
      displacementMm: input.displacementMm as number,
    }),
});
export const lvdtOutputVoltageTool = tool;
export const runLvdtOutputVoltage = tool.execute;
export default tool;
