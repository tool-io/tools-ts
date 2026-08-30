import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly travelSpeedMmPerSecond: number;
  readonly wobbleAmplitudeMillimeters: number;
  readonly wobbleFrequencyHertz: number;
  readonly spotDiameterMillimeters: number;
}>;
export type Output = Readonly<{
  readonly pathLengthFactor: number;
  readonly effectiveCoverageWidthMillimeters: number;
  readonly wobbleCyclesPerMillimeter: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.travelSpeedMmPerSecond <= 0)
    simpleError(
      "travelSpeedMmPerSecond",
      "Travel speed must be positive.",
      "invalid_speed",
    );
  const slope =
    (2 *
      Math.PI *
      input.wobbleAmplitudeMillimeters *
      input.wobbleFrequencyHertz) /
    input.travelSpeedMmPerSecond;
  return {
    pathLengthFactor: Math.sqrt(1 + slope * slope),
    effectiveCoverageWidthMillimeters:
      input.spotDiameterMillimeters + 2 * input.wobbleAmplitudeMillimeters,
    wobbleCyclesPerMillimeter:
      input.wobbleFrequencyHertz / input.travelSpeedMmPerSecond,
  };
};

export const exampleInput = {
  travelSpeedMmPerSecond: 10,
  wobbleAmplitudeMillimeters: 0,
  wobbleFrequencyHertz: 100,
  spotDiameterMillimeters: 1,
} satisfies Input;
export const exampleOutput = {
  pathLengthFactor: 1,
  effectiveCoverageWidthMillimeters: 1,
  wobbleCyclesPerMillimeter: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      travelSpeedMmPerSecond: input.travelSpeedMmPerSecond as number,
      wobbleAmplitudeMillimeters: input.wobbleAmplitudeMillimeters as number,
      wobbleFrequencyHertz: input.wobbleFrequencyHertz as number,
      spotDiameterMillimeters: input.spotDiameterMillimeters as number,
    }),
  description:
    "Estimate sinusoidal wobble path factor, coverage width, and cycle density.",
  id: "laser/wobble-weld-coverage",
  inputs: [
    {
      id: "travelSpeedMmPerSecond",
      label: "Travel speed",
      kind: "number",
      minimum: 0,
      unit: "mm/s",
    },
    {
      id: "wobbleAmplitudeMillimeters",
      label: "Wobble amplitude",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "wobbleFrequencyHertz",
      label: "Wobble frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "spotDiameterMillimeters",
      label: "Spot diameter",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "pathLengthFactor",
      label: "Wobble path-length factor",
      kind: "number",
      minimum: 1,
    },
    {
      id: "effectiveCoverageWidthMillimeters",
      label: "Effective coverage width",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "wobbleCyclesPerMillimeter",
      label: "Wobble cycles per travel millimeter",
      kind: "number",
      minimum: 0,
      unit: "cycles/mm",
    },
  ],
  title: "Wobble Weld Coverage",
});

export const run = tool.execute;
export default tool;
