import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly binaryFlowMask: readonly number[];
  readonly imageWidthPixels: number;
  readonly pixelPitchMicrometers: number;
}>;
export type Output = Readonly<{
  readonly avascularPixelCount: number;
  readonly avascularAreaSquareMillimeters: number;
  readonly avascularFraction: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.binaryFlowMask.length === 0 ||
    input.binaryFlowMask.length % input.imageWidthPixels !== 0 ||
    input.binaryFlowMask.some((value) => value !== 0 && value !== 1)
  )
    simpleError(
      "binaryFlowMask",
      "Mask must contain zero/one values in complete image rows.",
      "invalid_mask",
    );
  const avascularPixelCount = input.binaryFlowMask.filter(
    (value) => value === 0,
  ).length;
  return {
    avascularPixelCount,
    avascularAreaSquareMillimeters:
      (avascularPixelCount * input.pixelPitchMicrometers ** 2) / 1e6,
    avascularFraction: avascularPixelCount / input.binaryFlowMask.length,
  };
};

export const exampleInput = {
  binaryFlowMask: [0, 1, 0, 1],
  imageWidthPixels: 2,
  pixelPitchMicrometers: 10,
} satisfies Input;
export const exampleOutput = {
  avascularPixelCount: 2,
  avascularAreaSquareMillimeters: 0.0002,
  avascularFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      binaryFlowMask: input.binaryFlowMask as readonly number[],
      imageWidthPixels: input.imageWidthPixels as number,
      pixelPitchMicrometers: input.pixelPitchMicrometers as number,
    }),
  description:
    "Measure zero-flow area and fraction from a binary OCTA flow mask.",
  id: "laser/octa-avascular-area",
  inputs: [
    {
      id: "binaryFlowMask",
      label: "Binary OCTA flow mask",
      kind: "numberList",
    },
    {
      id: "imageWidthPixels",
      label: "Image width",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "pixelPitchMicrometers",
      label: "Pixel pitch",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
  ],
  outputs: [
    {
      id: "avascularPixelCount",
      label: "Avascular pixel count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "avascularAreaSquareMillimeters",
      label: "Avascular area",
      kind: "number",
      minimum: 0,
      unit: "mm²",
    },
    {
      id: "avascularFraction",
      label: "Avascular fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "OCTA Avascular Area",
});

export const run = tool.execute;
export default tool;
