import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IrcCorrectedTimeInput = {
  readonly elapsedSeconds: number;
  readonly timeCorrectionFactor: number;
};

export type IrcCorrectedTimeOutput = {
  readonly correctedTimeSeconds: number;
};

export const ircCorrectedTimeExample = {
  input: { elapsedSeconds: 3600, timeCorrectionFactor: 0.95 },
  output: { correctedTimeSeconds: 3420 },
} satisfies ToolExample<IrcCorrectedTimeInput, IrcCorrectedTimeOutput>;

export const calculateIrcCorrectedTime = (
  input: IrcCorrectedTimeInput,
): IrcCorrectedTimeOutput => {
  if (input.elapsedSeconds < 0)
    simpleError(
      "elapsedSeconds",
      "The elapsed time cannot be negative.",
      "invalid_input",
    );
  return {
    correctedTimeSeconds: input.elapsedSeconds * input.timeCorrectionFactor,
  };
};

export const ircCorrectedTimeTool = createSimpleTool({
  calculate: (input) =>
    calculateIrcCorrectedTime(input as unknown as IrcCorrectedTimeInput),
  description:
    "Compute IRC corrected time by multiplying elapsed time by the boat's published time correction coefficient (TCC).",
  id: "sailing/irc-corrected-time",
  inputs: [
    {
      description: "Time on course from start signal to finish.",
      format: "duration-s",
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed time",
      minimum: 0,
      unit: "s",
    },
    {
      description:
        "IRC rating expressed as a time correction factor between zero point eight and one point three.",
      format: "factor",
      id: "timeCorrectionFactor",
      kind: "number",
      label: "Time correction factor",
      maximum: 1.3,
      minimum: 0.8,
    },
  ],
  outputs: [
    {
      description: "Corrected finish time used to score the race.",
      format: "duration-s",
      id: "correctedTimeSeconds",
      kind: "number",
      label: "Corrected time",
      unit: "s",
    },
  ],
  title: "IRC Corrected Time Calculator",
});
export const runIrcCorrectedTime = ircCorrectedTimeTool.execute;
export default ircCorrectedTimeTool;
