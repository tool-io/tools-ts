import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fundamentalBendLossDbPerMeter: number;
  readonly homBendLossDbPerMeter: number;
  readonly bentLengthMeters: number;
  readonly initialHomToFundamentalRatio: number;
}>;
export type Output = Readonly<{
  readonly differentialSuppressionDb: number;
  readonly outputHomToFundamentalRatio: number;
  readonly fundamentalTransmissionFraction: number;
}>;

export const calculate = (input: Input): Output => {
  const differentialSuppressionDb =
    (input.homBendLossDbPerMeter - input.fundamentalBendLossDbPerMeter) *
    input.bentLengthMeters;
  return {
    differentialSuppressionDb,
    outputHomToFundamentalRatio:
      input.initialHomToFundamentalRatio *
      10 ** (-differentialSuppressionDb / 10),
    fundamentalTransmissionFraction:
      10 **
      ((-input.fundamentalBendLossDbPerMeter * input.bentLengthMeters) / 10),
  };
};

export const exampleInput = {
  fundamentalBendLossDbPerMeter: 1,
  homBendLossDbPerMeter: 11,
  bentLengthMeters: 1,
  initialHomToFundamentalRatio: 1,
} satisfies Input;
export const exampleOutput = {
  differentialSuppressionDb: 10,
  outputHomToFundamentalRatio: 0.1,
  fundamentalTransmissionFraction: 0.7943282347242815,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      fundamentalBendLossDbPerMeter:
        input.fundamentalBendLossDbPerMeter as number,
      homBendLossDbPerMeter: input.homBendLossDbPerMeter as number,
      bentLengthMeters: input.bentLengthMeters as number,
      initialHomToFundamentalRatio:
        input.initialHomToFundamentalRatio as number,
    }),
  description:
    "Calculate bend-induced higher-order-mode suppression relative to the fundamental mode.",
  id: "laser/hom-bend-suppression",
  inputs: [
    {
      id: "fundamentalBendLossDbPerMeter",
      label: "Fundamental-mode bend loss",
      kind: "number",
      minimum: 0,
      unit: "dB/m",
    },
    {
      id: "homBendLossDbPerMeter",
      label: "HOM bend loss",
      kind: "number",
      minimum: 0,
      unit: "dB/m",
    },
    {
      id: "bentLengthMeters",
      label: "Bent fiber length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "initialHomToFundamentalRatio",
      label: "Initial HOM/fundamental power ratio",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "differentialSuppressionDb",
      label: "Differential HOM suppression",
      kind: "number",
      unit: "dB",
    },
    {
      id: "outputHomToFundamentalRatio",
      label: "Output HOM/fundamental ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "fundamentalTransmissionFraction",
      label: "Fundamental transmission",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "HOM Bend Suppression",
});

export const run = tool.execute;
export default tool;
