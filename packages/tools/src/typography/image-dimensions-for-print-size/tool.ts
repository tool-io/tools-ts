import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, integer } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly desiredPrintWidthInches: number;
  readonly desiredPrintHeightInches: number;
  readonly callerPixelsPerPrintInch: number;
}>;
export type Output = Readonly<{
  readonly requiredIntegerPixelDimensions: readonly number[];
  readonly integerRasterExcessPixels: readonly number[];
}>;
const inputFields = [
  {
    id: "desiredPrintWidthInches",
    label: "Desired print width inches",
    kind: "number",
  },
  {
    id: "desiredPrintHeightInches",
    label: "Desired print height inches",
    kind: "number",
  },
  {
    id: "callerPixelsPerPrintInch",
    label: "Caller pixels per print inch",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.desiredPrintWidthInches, "desiredPrintWidthInches");
  positive(input.desiredPrintHeightInches, "desiredPrintHeightInches");
  positive(input.callerPixelsPerPrintInch, "callerPixelsPerPrintInch");
  const exact = [
      input.desiredPrintWidthInches,
      input.desiredPrintHeightInches,
    ].map((v) => v * input.callerPixelsPerPrintInch),
    n = exact.map((v) => integer(Math.ceil(v), "rasterdimensions"));
  return {
    requiredIntegerPixelDimensions: n,
    integerRasterExcessPixels: n.map((v, i) => v - exact[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  desiredPrintWidthInches: 4,
  desiredPrintHeightInches: 3,
  callerPixelsPerPrintInch: 300,
} satisfies Input;
export const exampleOutput = {
  requiredIntegerPixelDimensions: [1200, 900],
  integerRasterExcessPixels: [0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/image-dimensions-for-print-size",
  title: "Image Dimensions For Print Size",
  description:
    "Compute both whole raster dimensions by rounding print inches times target pixels-per-inch upward, retaining pixel excess. Not printer halftone DPI, font point height or a print-quality guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredIntegerPixelDimensions",
      label: "Required integer pixel dimensions",
      kind: "numberList",
    },
    {
      id: "integerRasterExcessPixels",
      label: "Integer raster excess pixels",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      desiredPrintWidthInches: value.desiredPrintWidthInches as number,
      desiredPrintHeightInches: value.desiredPrintHeightInches as number,
      callerPixelsPerPrintInch: value.callerPixelsPerPrintInch as number,
    }),
});
export const run = tool.execute;
export default tool;
