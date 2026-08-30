import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly elapsedSeconds: number;
  readonly maximumSeconds: number;
}>;
export type Output = Readonly<{
  readonly marginSeconds: number;
  readonly withinTarget: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.elapsedSeconds <= 0 || input.maximumSeconds <= 0)
    simpleError(
      "elapsedSeconds",
      "Positive timed-up-and-go result and caller target required.",
    );
  return {
    marginSeconds: input.maximumSeconds - input.elapsedSeconds,
    withinTarget: input.elapsedSeconds <= input.maximumSeconds,
  };
};
export const exampleInput = {
  elapsedSeconds: 12,
  maximumSeconds: 13.5,
} satisfies Input;
export const exampleOutput = {
  marginSeconds: 1.5,
  withinTarget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/timed-up-and-go-screen",
  title: "Timed Up And Go Screen",
  description:
    "Compare a Timed Up and Go result with an explicitly supplied threshold.",
  inputs: [
    { id: "elapsedSeconds", label: "Elapsed seconds", kind: "number" },
    { id: "maximumSeconds", label: "Maximum seconds", kind: "number" },
  ],
  outputs: [
    { id: "marginSeconds", label: "Margin seconds", kind: "number" },
    { id: "withinTarget", label: "Within target", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      elapsedSeconds: value.elapsedSeconds as number,
      maximumSeconds: value.maximumSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
