import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fiveRiseSeconds: number;
  readonly maximumSeconds: number;
}>;
export type Output = Readonly<{
  readonly marginSeconds: number;
  readonly withinTarget: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.fiveRiseSeconds <= 0 || input.maximumSeconds <= 0)
    simpleError(
      "fiveRiseSeconds",
      "Positive timed test and caller target required.",
    );
  return {
    marginSeconds: input.maximumSeconds - input.fiveRiseSeconds,
    withinTarget: input.fiveRiseSeconds <= input.maximumSeconds,
  };
};
export const exampleInput = {
  fiveRiseSeconds: 14,
  maximumSeconds: 15,
} satisfies Input;
export const exampleOutput = {
  marginSeconds: 1,
  withinTarget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/five-times-sit-to-stand-screen",
  title: "Five Times Sit To Stand Screen",
  description:
    "Compare five-times sit-to-stand time against an explicit clinical target.",
  inputs: [
    { id: "fiveRiseSeconds", label: "Five rise seconds", kind: "number" },
    { id: "maximumSeconds", label: "Maximum seconds", kind: "number" },
  ],
  outputs: [
    { id: "marginSeconds", label: "Margin seconds", kind: "number" },
    { id: "withinTarget", label: "Within target", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      fiveRiseSeconds: value.fiveRiseSeconds as number,
      maximumSeconds: value.maximumSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
