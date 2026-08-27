import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EmiFilterCutoffFrequencyInput = {
  readonly cFarads: number;
  readonly lHenry: number;
};

export type EmiFilterCutoffFrequencyOutput = {
  readonly cutoffFrequencyKhz: number;
};

export const emiFilterCutoffFrequencyExample = {
  input: { cFarads: 1e-6, lHenry: 0.01 },
  output: { cutoffFrequencyKhz: 15915.494309189533 },
} satisfies ToolExample<
  EmiFilterCutoffFrequencyInput,
  EmiFilterCutoffFrequencyOutput
>;

export const calculateEmiFilterCutoffFrequency = (
  input: EmiFilterCutoffFrequencyInput,
): EmiFilterCutoffFrequencyOutput => {
  if (!(input.lHenry > 0))
    simpleError("lHenry", "Inductance must be positive.", "invalid_inductance");
  if (!(input.cFarads > 0))
    simpleError(
      "cFarads",
      "Capacitance must be positive.",
      "invalid_capacitance",
    );
  return {
    cutoffFrequencyKhz: 1 / (2 * Math.PI * input.lHenry * input.cFarads) / 1000,
  };
};

export const emiFilterCutoffFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculateEmiFilterCutoffFrequency(
      input as unknown as EmiFilterCutoffFrequencyInput,
    ),
  description:
    "Compute the cutoff frequency in kilohertz of an LC EMI filter from its inductance and capacitance using SI units.",
  id: "electronics/emi-filter-cutoff-frequency",
  inputs: [
    {
      description: "Filter inductance in henries.",
      id: "lHenry",
      kind: "number",
      label: "Inductance",
      unit: "H",
    },
    {
      description: "Filter capacitance in farads.",
      id: "cFarads",
      kind: "number",
      label: "Capacitance",
      unit: "F",
    },
  ],
  outputs: [
    {
      description: "Corner frequency of the filter.",
      id: "cutoffFrequencyKhz",
      kind: "number",
      label: "Cutoff frequency",
      unit: "kHz",
    },
  ],
  title: "EMI Filter Cutoff",
});
export const runEmiFilterCutoffFrequency = emiFilterCutoffFrequencyTool.execute;
export default emiFilterCutoffFrequencyTool;
