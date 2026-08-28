import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ringOscillatorFrequencyExample = {
  input: { delayPs: 10, stagesInt: 2 },
  output: { ringFrequencyGhz: 25 },
} satisfies ToolExample<
  { readonly delayPs: number; readonly stagesInt: number },
  { readonly ringFrequencyGhz: number }
>;

export const ringOscillatorFrequencyTool = createSimpleTool({
  id: "electronics/ring-oscillator-frequency",
  title: "Ring Oscillator Frequency",
  description:
    "Compute the oscillation frequency of a ring oscillator f = 1 / (2 * N * td) in gigahertz.",
  inputs: [
    {
      id: "stagesInt",
      kind: "integer",
      label: "Stages",
      minimum: 2,
      unit: "stages",
    },
    { id: "delayPs", kind: "number", label: "Stage delay", unit: "ps" },
  ],
  outputs: [
    {
      format: "frequency-hz",
      id: "ringFrequencyGhz",
      kind: "number",
      label: "Ring frequency",
      unit: "GHz",
    },
  ],
  calculate: (input) => {
    const stages = input.stagesInt as number;
    if (stages % 2 !== 0)
      simpleError(
        "stagesInt",
        "The stage count must be an even integer of at least two.",
        "invalid_stages",
      );
    const delayPs = input.delayPs as number;
    if (delayPs <= 0)
      simpleError(
        "delayPs",
        "The stage delay must be greater than zero picoseconds.",
        "invalid_delay",
      );
    const frequencyHz = 1 / (2 * stages * delayPs * 1e-12);
    return { ringFrequencyGhz: frequencyHz / 1e9 };
  },
});
export const runRingOscillatorFrequency = ringOscillatorFrequencyTool.execute;
export default ringOscillatorFrequencyTool;
