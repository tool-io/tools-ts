import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly laserOnSignal: number;
  readonly laserOffSignal: number;
}>;
export type Output = Readonly<{
  readonly modulationAmplitude: number;
  readonly relativeContrastPercent: number;
  readonly normalizedDifference: number;
}>;

export const calculate = (input: Input): Output => {
  const modulationAmplitude = input.laserOnSignal - input.laserOffSignal;
  if (
    input.laserOffSignal === 0 ||
    input.laserOnSignal + input.laserOffSignal === 0
  )
    simpleError(
      "laserOffSignal",
      "Signals must support nonzero normalizations.",
      "invalid_denominator",
    );
  return {
    modulationAmplitude,
    relativeContrastPercent: (modulationAmplitude / input.laserOffSignal) * 100,
    normalizedDifference:
      modulationAmplitude / (input.laserOnSignal + input.laserOffSignal),
  };
};

export const exampleInput = {
  laserOnSignal: 120,
  laserOffSignal: 100,
} satisfies Input;
export const exampleOutput = {
  modulationAmplitude: 20,
  relativeContrastPercent: 20,
  normalizedDifference: 0.09090909090909091,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      laserOnSignal: input.laserOnSignal as number,
      laserOffSignal: input.laserOffSignal as number,
    }),
  description:
    "Calculate optogalvanic modulation amplitude and normalized contrast.",
  id: "laser/optogalvanic-modulation-contrast",
  inputs: [
    {
      id: "laserOnSignal",
      label: "Laser-on electrical signal",
      kind: "number",
    },
    {
      id: "laserOffSignal",
      label: "Laser-off electrical signal",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "modulationAmplitude",
      label: "Optogalvanic modulation amplitude",
      kind: "number",
    },
    {
      id: "relativeContrastPercent",
      label: "Relative modulation contrast",
      kind: "number",
      unit: "%",
    },
    {
      id: "normalizedDifference",
      label: "Normalized difference",
      kind: "number",
    },
  ],
  title: "Optogalvanic Modulation Contrast",
});

export const run = tool.execute;
export default tool;
