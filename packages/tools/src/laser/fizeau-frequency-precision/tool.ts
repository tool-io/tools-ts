import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly scanSpanHertz: number;
  readonly sampleCount: number;
  readonly subBinPrecisionFraction: number;
}>;
export type Output = Readonly<{
  readonly fftBinWidthHertz: number;
  readonly estimatedPrecisionHertz: number;
}>;

export const calculate = (input: Input): Output => {
  const fftBinWidthHertz = input.scanSpanHertz / input.sampleCount;
  return {
    fftBinWidthHertz,
    estimatedPrecisionHertz: fftBinWidthHertz * input.subBinPrecisionFraction,
  };
};

export const exampleInput = {
  scanSpanHertz: 1000,
  sampleCount: 100,
  subBinPrecisionFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  fftBinWidthHertz: 10,
  estimatedPrecisionHertz: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      scanSpanHertz: input.scanSpanHertz as number,
      sampleCount: input.sampleCount as number,
      subBinPrecisionFraction: input.subBinPrecisionFraction as number,
    }),
  description:
    "Estimate Fizeau wavemeter precision from scan span, FFT size, and interpolation precision.",
  id: "laser/fizeau-frequency-precision",
  inputs: [
    {
      id: "scanSpanHertz",
      label: "Frequency scan span",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "sampleCount",
      label: "FFT sample count",
      kind: "integer",
      minimum: 2,
    },
    {
      id: "subBinPrecisionFraction",
      label: "Sub-bin precision fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "fftBinWidthHertz",
      label: "FFT bin width",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "estimatedPrecisionHertz",
      label: "Estimated frequency precision",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  title: "Fizeau Frequency Precision",
});

export const run = tool.execute;
export default tool;
