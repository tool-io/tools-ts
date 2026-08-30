import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly channelTransmittance: number;
  readonly achievedSecretBitsPerUse: number;
}>;
export type Output = Readonly<{
  readonly plobBoundBitsPerUse: number;
  readonly boundRatio: number;
  readonly exceedsPlobBound: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.channelTransmittance >= 1)
    simpleError(
      "channelTransmittance",
      "Transmittance must be less than one.",
      "singular_bound",
    );
  const plobBoundBitsPerUse = -Math.log2(1 - input.channelTransmittance);
  return {
    plobBoundBitsPerUse,
    boundRatio:
      plobBoundBitsPerUse === 0
        ? 0
        : input.achievedSecretBitsPerUse / plobBoundBitsPerUse,
    exceedsPlobBound: input.achievedSecretBitsPerUse > plobBoundBitsPerUse,
  };
};

export const exampleInput = {
  channelTransmittance: 0.1,
  achievedSecretBitsPerUse: 0.2,
} satisfies Input;
export const exampleOutput = {
  plobBoundBitsPerUse: 0.15200309344504995,
  boundRatio: 1.3157626957921171,
  exceedsPlobBound: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      channelTransmittance: input.channelTransmittance as number,
      achievedSecretBitsPerUse: input.achievedSecretBitsPerUse as number,
    }),
  description:
    "Compare an achieved twin-field secret-bit rate with the repeaterless PLOB bound.",
  id: "laser/twin-field-plob-comparison",
  inputs: [
    {
      id: "channelTransmittance",
      label: "Channel transmittance",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "achievedSecretBitsPerUse",
      label: "Achieved secret bits per use",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "plobBoundBitsPerUse",
      label: "Repeaterless PLOB bound",
      kind: "number",
      minimum: 0,
    },
    {
      id: "boundRatio",
      label: "Achieved-to-bound ratio",
      kind: "number",
      minimum: 0,
    },
    { id: "exceedsPlobBound", label: "Exceeds PLOB bound", kind: "boolean" },
  ],
  title: "Twin-Field PLOB Comparison",
});

export const run = tool.execute;
export default tool;
