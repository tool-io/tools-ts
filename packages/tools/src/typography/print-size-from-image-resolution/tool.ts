import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedPixelWidth: number;
  readonly observedPixelHeight: number;
  readonly callerPixelsPerPrintInch: number;
}>;
export type Output = Readonly<{
  readonly conditionalPrintWidthInches: number;
  readonly conditionalPrintHeightInches: number;
}>;
const inputFields = [
  { id: "observedPixelWidth", label: "Observed pixel width", kind: "number" },
  { id: "observedPixelHeight", label: "Observed pixel height", kind: "number" },
  {
    id: "callerPixelsPerPrintInch",
    label: "Caller pixels per print inch",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerPixelsPerPrintInch, "callerPixelsPerPrintInch");
  bounded(input.observedPixelWidth, "width", 1, 1000000);
  bounded(input.observedPixelHeight, "height", 1, 1000000);
  return {
    conditionalPrintWidthInches:
      input.observedPixelWidth / input.callerPixelsPerPrintInch,
    conditionalPrintHeightInches:
      input.observedPixelHeight / input.callerPixelsPerPrintInch,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPixelWidth: 1200,
  observedPixelHeight: 900,
  callerPixelsPerPrintInch: 300,
} satisfies Input;
export const exampleOutput = {
  conditionalPrintWidthInches: 4,
  conditionalPrintHeightInches: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/print-size-from-image-resolution",
  title: "Print Size From Image Resolution",
  description:
    "Convert independently measured raster width and height to print inches at explicit target PPI. Does not decode images, infer their resolution metadata or guarantee print quality.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalPrintWidthInches",
      label: "Conditional print width inches",
      kind: "number",
    },
    {
      id: "conditionalPrintHeightInches",
      label: "Conditional print height inches",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPixelWidth: value.observedPixelWidth as number,
      observedPixelHeight: value.observedPixelHeight as number,
      callerPixelsPerPrintInch: value.callerPixelsPerPrintInch as number,
    }),
});
export const run = tool.execute;
export default tool;
