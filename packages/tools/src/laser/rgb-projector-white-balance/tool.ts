import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly measuredRed: number;
  readonly measuredGreen: number;
  readonly measuredBlue: number;
  readonly targetRed: number;
  readonly targetGreen: number;
  readonly targetBlue: number;
}>;
export type Output = Readonly<{
  readonly rawChannelGains: readonly number[];
  readonly normalizedChannelGains: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  if (
    input.measuredRed <= 0 ||
    input.measuredGreen <= 0 ||
    input.measuredBlue <= 0
  )
    simpleError(
      "measuredRed",
      "Measured channel outputs must be positive.",
      "invalid_channel",
    );
  const rawChannelGains = [
    input.targetRed / input.measuredRed,
    input.targetGreen / input.measuredGreen,
    input.targetBlue / input.measuredBlue,
  ];
  const maximum = Math.max(...rawChannelGains);
  const normalizedChannelGains =
    maximum === 0 ? [0, 0, 0] : rawChannelGains.map((value) => value / maximum);
  return { rawChannelGains, normalizedChannelGains };
};

export const exampleInput = {
  measuredRed: 0.8,
  measuredGreen: 1,
  measuredBlue: 0.5,
  targetRed: 1,
  targetGreen: 1,
  targetBlue: 1,
} satisfies Input;
export const exampleOutput = {
  rawChannelGains: [1.25, 1, 2],
  normalizedChannelGains: [0.625, 0.5, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      measuredRed: input.measuredRed as number,
      measuredGreen: input.measuredGreen as number,
      measuredBlue: input.measuredBlue as number,
      targetRed: input.targetRed as number,
      targetGreen: input.targetGreen as number,
      targetBlue: input.targetBlue as number,
    }),
  description:
    "Calculate raw and peak-normalized RGB projector gains from measured and target channel outputs.",
  id: "laser/rgb-projector-white-balance",
  inputs: [
    {
      id: "measuredRed",
      label: "Measured red output",
      kind: "number",
      minimum: 0,
    },
    {
      id: "measuredGreen",
      label: "Measured green output",
      kind: "number",
      minimum: 0,
    },
    {
      id: "measuredBlue",
      label: "Measured blue output",
      kind: "number",
      minimum: 0,
    },
    { id: "targetRed", label: "Target red output", kind: "number", minimum: 0 },
    {
      id: "targetGreen",
      label: "Target green output",
      kind: "number",
      minimum: 0,
    },
    {
      id: "targetBlue",
      label: "Target blue output",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "rawChannelGains", label: "Raw RGB gains", kind: "numberList" },
    {
      id: "normalizedChannelGains",
      label: "Normalized RGB gains",
      kind: "numberList",
    },
  ],
  title: "RGB Projector White Balance",
});

export const run = tool.execute;
export default tool;
