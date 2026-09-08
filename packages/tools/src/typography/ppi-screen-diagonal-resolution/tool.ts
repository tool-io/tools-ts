import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly pixelWidth: number;
  readonly pixelHeight: number;
  readonly physicalDiagonalInches: number;
}>;
export type Output = Readonly<{ readonly physicalPixelsPerInch: number }>;
const inputFields = [
  { id: "pixelWidth", label: "Pixel width", kind: "number" },
  { id: "pixelHeight", label: "Pixel height", kind: "number" },
  {
    id: "physicalDiagonalInches",
    label: "Physical diagonal inches",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.physicalDiagonalInches, "physicalDiagonalInches");
  bounded(input.pixelWidth, "width", 1, 1000000);
  bounded(input.pixelHeight, "height", 1, 1000000);
  return {
    physicalPixelsPerInch:
      Math.hypot(input.pixelWidth, input.pixelHeight) /
      input.physicalDiagonalInches,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pixelWidth: 1920,
  pixelHeight: 1080,
  physicalDiagonalInches: 24,
} satisfies Input;
export const exampleOutput = {
  physicalPixelsPerInch: 91.7877987534291,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/ppi-screen-diagonal-resolution",
  title: "Screen PPI From Diagonal Resolution",
  description:
    "Physical diagonal PPI from actual raster and physical panel diagonal, not CSS96 ppi or device pixel ratio. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "physicalPixelsPerInch",
      label: "Physical pixels per inch",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pixelWidth: value.pixelWidth as number,
      pixelHeight: value.pixelHeight as number,
      physicalDiagonalInches: value.physicalDiagonalInches as number,
    }),
});
export const run = tool.execute;
export default tool;
