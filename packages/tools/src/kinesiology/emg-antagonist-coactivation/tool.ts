import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly agonistRms: number;
  readonly antagonistRms: number;
  readonly agonistOnsetMs: number;
  readonly antagonistOnsetMs: number;
}>;
export type Output = Readonly<{
  readonly coactivationPercent: number;
  readonly onsetLagMs: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.agonistRms <= 0 || input.antagonistRms < 0)
    simpleError(
      "agonistRms",
      "Positive agonist and nonnegative antagonist EMG RMS required.",
    );
  return {
    coactivationPercent: (100 * input.antagonistRms) / input.agonistRms,
    onsetLagMs: input.antagonistOnsetMs - input.agonistOnsetMs,
  };
};
export const exampleInput = {
  agonistRms: 1,
  antagonistRms: 0.3,
  agonistOnsetMs: 100,
  antagonistOnsetMs: 120,
} satisfies Input;
export const exampleOutput = {
  coactivationPercent: 30,
  onsetLagMs: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/emg-antagonist-coactivation",
  title: "EMG Antagonist Coactivation",
  description:
    "Measure antagonist EMG amplitude relative to agonist and onset lag.",
  inputs: [
    { id: "agonistRms", label: "Agonist rms", kind: "number" },
    { id: "antagonistRms", label: "Antagonist rms", kind: "number" },
    { id: "agonistOnsetMs", label: "Agonist onset ms", kind: "number" },
    { id: "antagonistOnsetMs", label: "Antagonist onset ms", kind: "number" },
  ],
  outputs: [
    {
      id: "coactivationPercent",
      label: "Coactivation percent",
      kind: "number",
    },
    { id: "onsetLagMs", label: "Onset lag ms", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      agonistRms: value.agonistRms as number,
      antagonistRms: value.antagonistRms as number,
      agonistOnsetMs: value.agonistOnsetMs as number,
      antagonistOnsetMs: value.antagonistOnsetMs as number,
    }),
});
export const run = tool.execute;
export default tool;
