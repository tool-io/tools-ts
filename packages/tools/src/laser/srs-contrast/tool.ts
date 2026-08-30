import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pumpOnIntensity: number;
  readonly pumpOffIntensity: number;
}>;
export type Output = Readonly<{
  readonly stimulatedRamanLoss: number;
  readonly srsContrastPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.pumpOffIntensity <= 0)
    simpleError(
      "pumpOffIntensity",
      "Pump-off intensity must be positive.",
      "invalid_reference",
    );
  const stimulatedRamanLoss = input.pumpOffIntensity - input.pumpOnIntensity;
  return {
    stimulatedRamanLoss,
    srsContrastPercent: (stimulatedRamanLoss / input.pumpOffIntensity) * 100,
  };
};

export const exampleInput = {
  pumpOnIntensity: 98,
  pumpOffIntensity: 100,
} satisfies Input;
export const exampleOutput = {
  stimulatedRamanLoss: 2,
  srsContrastPercent: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pumpOnIntensity: input.pumpOnIntensity as number,
      pumpOffIntensity: input.pumpOffIntensity as number,
    }),
  description:
    "Calculate stimulated Raman loss contrast from pump-on and pump-off probe measurements.",
  id: "laser/srs-contrast",
  inputs: [
    {
      id: "pumpOnIntensity",
      label: "Pump-on probe intensity",
      kind: "number",
      minimum: 0,
    },
    {
      id: "pumpOffIntensity",
      label: "Pump-off probe intensity",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stimulatedRamanLoss",
      label: "Stimulated Raman loss",
      kind: "number",
    },
    {
      id: "srsContrastPercent",
      label: "SRS contrast",
      kind: "number",
      unit: "%",
    },
  ],
  title: "SRS Contrast",
});

export const run = tool.execute;
export default tool;
