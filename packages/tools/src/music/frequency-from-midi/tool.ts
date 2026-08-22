import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const frequencyFromMidiTool = createSimpleTool({
  id: "music/frequency-from-midi",
  title: "Frequency From MIDI Calculator",
  description:
    "Convert a MIDI note number to its equal-tempered frequency with A4 = 440 Hz.",
  inputs: [
    {
      id: "midi",
      label: "MIDI note",
      kind: "integer",
      maximum: 127,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Equal-tempered frequency in hertz.",
      id: "hz",
      label: "Frequency",
      kind: "number",
      unit: "Hz",
    },
  ],
  calculate: (input) => {
    return {
      hz: 440 * 2 ** (((input.midi as number) - 69) / 12),
    };
  },
});
export const runFrequencyFromMidi = frequencyFromMidiTool.execute;
export default frequencyFromMidiTool;

export type FrequencyFromMidiInput = {
  readonly midi: number;
};

export type FrequencyFromMidiOutput = {
  readonly hz: number;
};

export const frequencyFromMidiExample = {
  input: { midi: 69 },
  output: { hz: 440 },
} satisfies ToolExample<FrequencyFromMidiInput, FrequencyFromMidiOutput>;
