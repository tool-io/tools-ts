import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly distributedGainPerMeter: number;
  readonly fiberLengthMeters: number;
  readonly roundTripLogLoss: number;
}>;
export type Output = Readonly<{
  readonly netLogGain: number;
  readonly roundTripPowerFactor: number;
  readonly aboveThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  const netLogGain =
    input.distributedGainPerMeter * input.fiberLengthMeters -
    input.roundTripLogLoss;
  return {
    netLogGain,
    roundTripPowerFactor: Math.exp(netLogGain),
    aboveThreshold: netLogGain >= 0,
  };
};

export const exampleInput = {
  distributedGainPerMeter: 0.2,
  fiberLengthMeters: 10,
  roundTripLogLoss: 1.5,
} satisfies Input;
export const exampleOutput = {
  netLogGain: 0.5,
  roundTripPowerFactor: 1.6487212707001282,
  aboveThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      distributedGainPerMeter: input.distributedGainPerMeter as number,
      fiberLengthMeters: input.fiberLengthMeters as number,
      roundTripLogLoss: input.roundTripLogLoss as number,
    }),
  description:
    "Compare distributed random-fiber gain with supplied round-trip logarithmic loss.",
  id: "laser/random-fiber-laser-threshold",
  inputs: [
    {
      id: "distributedGainPerMeter",
      label: "Distributed gain coefficient",
      kind: "number",
      unit: "1/m",
    },
    {
      id: "fiberLengthMeters",
      label: "Fiber length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "roundTripLogLoss",
      label: "Round-trip logarithmic loss",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "netLogGain", label: "Net logarithmic gain", kind: "number" },
    {
      id: "roundTripPowerFactor",
      label: "Round-trip power factor",
      kind: "number",
      minimum: 0,
    },
    { id: "aboveThreshold", label: "Above threshold", kind: "boolean" },
  ],
  title: "Random-Fiber Laser Threshold",
});

export const run = tool.execute;
export default tool;
