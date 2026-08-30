import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RelaxationOscillatorFrequencyInput = Readonly<{
  readonly currentAmperes: number;
  readonly capacitanceFarads: number;
  readonly voltageSwingVolts: number;
}>;
export type RelaxationOscillatorFrequencyOutput = Readonly<{
  readonly frequencyHz: number;
}>;

export const calculateRelaxationOscillatorFrequency = (
  x: RelaxationOscillatorFrequencyInput,
): RelaxationOscillatorFrequencyOutput => {
  if (!Number.isFinite(x.currentAmperes) || x.currentAmperes < 0)
    simpleError("currentAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.capacitanceFarads) || x.capacitanceFarads < 0)
    simpleError("capacitanceFarads", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.voltageSwingVolts) || x.voltageSwingVolts < 0)
    simpleError("voltageSwingVolts", "Provide a finite number at least 0.");
  const frequencyHz =
    x.currentAmperes / (2 * x.capacitanceFarads * x.voltageSwingVolts);
  if (!Number.isFinite(frequencyHz))
    simpleError(
      "frequencyHz",
      "Inputs produce an undefined or non-finite result.",
    );
  return { frequencyHz: Object.is(frequencyHz, -0) ? 0 : frequencyHz };
};

export const example = {
  input: {
    currentAmperes: 0.001,
    capacitanceFarads: 0.000001,
    voltageSwingVolts: 1,
  },
  output: { frequencyHz: 500.00000000000006 },
} satisfies ToolExample<
  RelaxationOscillatorFrequencyInput,
  RelaxationOscillatorFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/relaxation-oscillator-frequency",
  title: "Relaxation Oscillator Frequency",
  description:
    "Full-cycle frequency for symmetric constant-current charging and discharging across a voltage swing ΔV.",
  inputs: [
    {
      id: "currentAmperes",
      kind: "number",
      label: "Current Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance Farads",
      unit: "F",
      minimum: 0,
    },
    {
      id: "voltageSwingVolts",
      kind: "number",
      label: "Voltage Swing Volts",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "frequencyHz", kind: "number", label: "Frequency Hz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateRelaxationOscillatorFrequency({
      currentAmperes: input.currentAmperes as number,
      capacitanceFarads: input.capacitanceFarads as number,
      voltageSwingVolts: input.voltageSwingVolts as number,
    }),
});
export const relaxationOscillatorFrequencyTool = tool;
export const runRelaxationOscillatorFrequency = tool.execute;
export default tool;
