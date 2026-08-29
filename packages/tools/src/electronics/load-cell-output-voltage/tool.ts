import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LoadCellOutputVoltageInput = Readonly<{
  readonly excitationVoltageV: number;
  readonly sensitivityMvPerV: number;
  readonly loadFraction: number;
}>;
export type LoadCellOutputVoltageOutput = Readonly<{ outputVoltageV: number }>;

export const calculateLoadCellOutputVoltage = (
  i: LoadCellOutputVoltageInput,
): LoadCellOutputVoltageOutput => {
  const value =
    (i.excitationVoltageV * i.sensitivityMvPerV * i.loadFraction) / 1000;
  if (!Number.isFinite(value))
    simpleError("outputVoltageV", "The inputs produce a non-finite result.");
  return { outputVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { excitationVoltageV: 5, sensitivityMvPerV: 2, loadFraction: 0.5 },
  output: { outputVoltageV: 0.005 },
} satisfies ToolExample<
  LoadCellOutputVoltageInput,
  LoadCellOutputVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/load-cell-output-voltage",
  title: "Load Cell Output Voltage",
  description:
    "Estimate load-cell voltage from excitation voltage, full-scale sensitivity in millivolts per volt, and fraction of rated load; linear response is assumed.",
  inputs: [
    {
      id: "excitationVoltageV",
      kind: "number",
      label: "Excitation (V)",
      unit: "V",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "sensitivityMvPerV",
      kind: "number",
      label: "Sensitivity (mV/V)",
      unit: "mV/V",
      minimum: 0,
    },
    {
      id: "loadFraction",
      kind: "number",
      label: "Load Fraction",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "outputVoltageV", kind: "number", label: "Output (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculateLoadCellOutputVoltage({
      excitationVoltageV: input.excitationVoltageV as number,
      sensitivityMvPerV: input.sensitivityMvPerV as number,
      loadFraction: input.loadFraction as number,
    }),
});
export const loadCellOutputVoltageTool = tool;
export const runLoadCellOutputVoltage = tool.execute;
export default tool;
