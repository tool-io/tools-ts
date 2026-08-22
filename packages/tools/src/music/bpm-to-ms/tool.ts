import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const bpmToMsTool = createSimpleTool({
  id: "music/bpm-to-ms",
  title: "BPM to Milliseconds Converter",
  description: "Convert a beats-per-minute tempo to milliseconds per beat.",
  inputs: [
    {
      description: "Tempo in beats per minute; must be greater than zero.",
      id: "bpm",
      label: "Tempo",
      kind: "number",
      unit: "BPM",
    },
  ],
  outputs: [
    {
      description: "Duration of one beat.",
      id: "millisecondsPerBeat",
      label: "Milliseconds per beat",
      kind: "number",
      unit: "ms",
    },
  ],
  calculate: (input) => {
    const bpm = input.bpm as number;
    if (bpm <= 0)
      simpleError(
        "bpm",
        "The tempo must be greater than zero BPM.",
        "invalid_bpm",
      );
    return { millisecondsPerBeat: 60_000 / bpm };
  },
});
export const runBpmToMs = bpmToMsTool.execute;
export default bpmToMsTool;

export type BpmToMsInput = {
  readonly bpm: number;
};

export type BpmToMsOutput = {
  readonly millisecondsPerBeat: number;
};

export const bpmToMsExample = {
  input: { bpm: 120 },
  output: { millisecondsPerBeat: 500 },
} satisfies ToolExample<BpmToMsInput, BpmToMsOutput>;
