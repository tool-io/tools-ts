import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Input = Readonly<{
  readonly canSpeakFullSentences: boolean;
  readonly canSing: boolean;
}>;
export type Output = Readonly<{
  readonly talkTestBand: string;
}>;
export const calculate = (input: Input): Output => {
  return {
    talkTestBand: !input.canSpeakFullSentences
      ? "vigorous"
      : input.canSing
        ? "light"
        : "moderate",
  };
};
export const exampleInput = {
  canSpeakFullSentences: true,
  canSing: false,
} satisfies Input;
export const exampleOutput = { talkTestBand: "moderate" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/talk-test-intensity-screen",
  title: "Talk Test Intensity Screen",
  description:
    "Classify self-reported talk-test effort without claiming measured ventilatory thresholds.",
  inputs: [
    {
      id: "canSpeakFullSentences",
      label: "Can speak full sentences",
      kind: "boolean",
    },
    { id: "canSing", label: "Can sing", kind: "boolean" },
  ],
  outputs: [{ id: "talkTestBand", label: "Talk test band", kind: "string" }],
  calculate: (value) =>
    calculate({
      canSpeakFullSentences: value.canSpeakFullSentences as boolean,
      canSing: value.canSing as boolean,
    }),
});
export const run = tool.execute;
export default tool;
