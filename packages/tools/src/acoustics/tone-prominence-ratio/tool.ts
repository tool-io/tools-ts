import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly maskingNoiseLevelDecibels: number;
  readonly thresholdDecibels: number;
  readonly toneLevelDecibels: number;
}>;
export type Output = Readonly<{
  readonly prominentByCallerThreshold: boolean;
  readonly prominenceRatioDecibels: number;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value))
      simpleError(
        field,
        "Levels and threshold must be finite.",
        "invalid_value",
      );
  const prominenceRatioDecibels =
    input.toneLevelDecibels - input.maskingNoiseLevelDecibels;
  if (!Number.isFinite(prominenceRatioDecibels))
    simpleError(
      "toneLevelDecibels",
      "Level difference is out of range.",
      "numeric_overflow",
    );
  return {
    prominenceRatioDecibels,
    prominentByCallerThreshold:
      prominenceRatioDecibels >= input.thresholdDecibels,
  };
};

export const example = {
  input: {
    maskingNoiseLevelDecibels: 40,
    thresholdDecibels: 6,
    toneLevelDecibels: 48,
  },
  output: { prominenceRatioDecibels: 8, prominentByCallerThreshold: true },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    maskingNoiseLevelDecibels: 40,
    thresholdDecibels: 6,
    toneLevelDecibels: 44,
  },
  output: { prominenceRatioDecibels: 4, prominentByCallerThreshold: false },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      maskingNoiseLevelDecibels: input.maskingNoiseLevelDecibels as number,
      thresholdDecibels: input.thresholdDecibels as number,
      toneLevelDecibels: input.toneLevelDecibels as number,
    }),
  description:
    "Calculate a tone-minus-masking-noise prominence ratio and compare it with an explicit caller threshold; a complete ECMA tonal analysis requires band-specific processing.",
  id: "acoustics/tone-prominence-ratio",
  inputs: [
    {
      id: "maskingNoiseLevelDecibels",
      kind: "number",
      label: "Masking-noise level",
      unit: "dB",
    },
    {
      id: "thresholdDecibels",
      kind: "number",
      label: "Caller threshold",
      unit: "dB",
    },
    {
      id: "toneLevelDecibels",
      kind: "number",
      label: "Tone level",
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "prominenceRatioDecibels",
      kind: "number",
      label: "Prominence ratio",
      unit: "dB",
    },
    {
      id: "prominentByCallerThreshold",
      kind: "boolean",
      label: "Prominent by caller threshold",
    },
  ],
  title: "Tone Prominence Ratio",
});

export const run = tool.execute;
export default tool;
