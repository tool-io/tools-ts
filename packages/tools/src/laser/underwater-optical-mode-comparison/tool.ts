import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly greenAttenuationPerMeter: number;
  readonly blueAttenuationPerMeter: number;
  readonly waterPathMeters: number;
}>;
export type Output = Readonly<{
  readonly greenTransmissionFraction: number;
  readonly blueTransmissionFraction: number;
  readonly higherTransmissionBand: string;
}>;

export const calculate = (input: Input): Output => {
  const greenTransmissionFraction = Math.exp(
    -input.greenAttenuationPerMeter * input.waterPathMeters,
  );
  const blueTransmissionFraction = Math.exp(
    -input.blueAttenuationPerMeter * input.waterPathMeters,
  );
  return {
    greenTransmissionFraction,
    blueTransmissionFraction,
    higherTransmissionBand:
      greenTransmissionFraction === blueTransmissionFraction
        ? "tie"
        : greenTransmissionFraction > blueTransmissionFraction
          ? "green"
          : "blue",
  };
};

export const exampleInput = {
  greenAttenuationPerMeter: 0.1,
  blueAttenuationPerMeter: 0.3,
  waterPathMeters: 10,
} satisfies Input;
export const exampleOutput = {
  greenTransmissionFraction: 0.36787944117144233,
  blueTransmissionFraction: 0.049787068367863944,
  higherTransmissionBand: "green",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      greenAttenuationPerMeter: input.greenAttenuationPerMeter as number,
      blueAttenuationPerMeter: input.blueAttenuationPerMeter as number,
      waterPathMeters: input.waterPathMeters as number,
    }),
  description:
    "Compare Beer–Lambert transmission for two underwater optical bands.",
  id: "laser/underwater-optical-mode-comparison",
  inputs: [
    {
      id: "greenAttenuationPerMeter",
      label: "Green attenuation coefficient",
      kind: "number",
      minimum: 0,
      unit: "1/m",
    },
    {
      id: "blueAttenuationPerMeter",
      label: "Blue attenuation coefficient",
      kind: "number",
      minimum: 0,
      unit: "1/m",
    },
    {
      id: "waterPathMeters",
      label: "Water path",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "greenTransmissionFraction",
      label: "Green transmission",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "blueTransmissionFraction",
      label: "Blue transmission",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "higherTransmissionBand",
      label: "Higher-transmission band",
      kind: "string",
      enum: ["green", "blue", "tie"],
    },
  ],
  title: "Underwater Optical Mode Comparison",
});

export const run = tool.execute;
export default tool;
