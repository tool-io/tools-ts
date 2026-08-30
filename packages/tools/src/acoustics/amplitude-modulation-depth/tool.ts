import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly maximumLevelDecibels: number;
  readonly minimumLevelDecibels: number;
  readonly thresholdDecibels: number;
}>;
export type Output = Readonly<{
  readonly depthDecibels: number;
  readonly meetsCallerThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value))
      simpleError(
        field,
        "Levels and threshold must be finite.",
        "invalid_value",
      );
  if (input.maximumLevelDecibels < input.minimumLevelDecibels)
    simpleError(
      "maximumLevelDecibels",
      "Maximum must not be below minimum.",
      "invalid_order",
    );
  if (input.thresholdDecibels < 0)
    simpleError(
      "thresholdDecibels",
      "Threshold must be nonnegative.",
      "invalid_threshold",
    );
  const depthDecibels = input.maximumLevelDecibels - input.minimumLevelDecibels;
  if (!Number.isFinite(depthDecibels))
    simpleError(
      "maximumLevelDecibels",
      "Level difference is out of range.",
      "numeric_overflow",
    );
  return {
    depthDecibels,
    meetsCallerThreshold: depthDecibels >= input.thresholdDecibels,
  };
};

export const example = {
  input: {
    maximumLevelDecibels: 45,
    minimumLevelDecibels: 40,
    thresholdDecibels: 3,
  },
  output: { depthDecibels: 5, meetsCallerThreshold: true },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    maximumLevelDecibels: 40,
    minimumLevelDecibels: 40,
    thresholdDecibels: 1,
  },
  output: { depthDecibels: 0, meetsCallerThreshold: false },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      maximumLevelDecibels: input.maximumLevelDecibels as number,
      minimumLevelDecibels: input.minimumLevelDecibels as number,
      thresholdDecibels: input.thresholdDecibels as number,
    }),
  description:
    "Calculate peak-to-trough sound-level modulation depth and compare it with an explicit caller threshold; this is not a full regulatory OAM method.",
  id: "acoustics/amplitude-modulation-depth",
  inputs: [
    {
      id: "maximumLevelDecibels",
      kind: "number",
      label: "Maximum level",
      unit: "dB",
    },
    {
      id: "minimumLevelDecibels",
      kind: "number",
      label: "Minimum level",
      unit: "dB",
    },
    {
      id: "thresholdDecibels",
      kind: "number",
      label: "Caller modulation threshold",
      minimum: 0,
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "depthDecibels",
      kind: "number",
      label: "Peak-to-trough depth",
      minimum: 0,
      unit: "dB",
    },
    {
      id: "meetsCallerThreshold",
      kind: "boolean",
      label: "Meets caller threshold",
    },
  ],
  title: "Amplitude Modulation Depth",
});

export const run = tool.execute;
export default tool;
