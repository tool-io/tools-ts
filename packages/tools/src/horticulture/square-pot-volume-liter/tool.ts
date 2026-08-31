import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly interiorBottomWidthCm: number;
  readonly interiorBottomLengthCm: number;
  readonly interiorTopWidthCm: number;
  readonly interiorTopLengthCm: number;
  readonly interiorPotHeightCm: number;
  readonly callerFillHeightCm: number;
}>;
export type Output = Readonly<{
  readonly modeledFilledRectangularPotLiters: number;
  readonly modeledTopInteriorAreaCm2: number;
}>;
const inputFields = [
  {
    id: "interiorBottomWidthCm",
    label: "Interior bottom width cm",
    kind: "number",
  },
  {
    id: "interiorBottomLengthCm",
    label: "Interior bottom length cm",
    kind: "number",
  },
  { id: "interiorTopWidthCm", label: "Interior top width cm", kind: "number" },
  {
    id: "interiorTopLengthCm",
    label: "Interior top length cm",
    kind: "number",
  },
  {
    id: "interiorPotHeightCm",
    label: "Interior pot height cm",
    kind: "number",
  },
  { id: "callerFillHeightCm", label: "Caller fill height cm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.interiorBottomWidthCm, "interiorBottomWidthCm");
  positive(input.interiorBottomLengthCm, "interiorBottomLengthCm");
  positive(input.interiorTopWidthCm, "interiorTopWidthCm");
  positive(input.interiorTopLengthCm, "interiorTopLengthCm");
  positive(input.interiorPotHeightCm, "interiorPotHeightCm");
  nonnegative(input.callerFillHeightCm, "callerFillHeightCm");
  if (input.callerFillHeightCm > input.interiorPotHeightCm)
    simpleError("fill", "Fill above actual pot rejected.");
  const f = input.callerFillHeightCm / input.interiorPotHeightCm,
    bw = input.interiorBottomWidthCm,
    bl = input.interiorBottomLengthCm,
    dw = input.interiorTopWidthCm - bw,
    dl = input.interiorTopLengthCm - bl,
    h = input.callerFillHeightCm;
  return {
    modeledFilledRectangularPotLiters:
      (h * (bw * bl + ((bw * dl + bl * dw) * f) / 2 + (dw * dl * f * f) / 3)) /
      1000,
    modeledTopInteriorAreaCm2:
      input.interiorTopWidthCm * input.interiorTopLengthCm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  interiorBottomWidthCm: 10,
  interiorBottomLengthCm: 10,
  interiorTopWidthCm: 20,
  interiorTopLengthCm: 20,
  interiorPotHeightCm: 15,
  callerFillHeightCm: 15,
} satisfies Input;
export const exampleOutput = {
  modeledFilledRectangularPotLiters: 3.5,
  modeledTopInteriorAreaCm2: 400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/square-pot-volume-liter",
  title: "Square Pot Volume Liter Calculator",
  description:
    "Integrate actual straight independently tapered rectangular pot walls at caller fill height; not nominal square-pot prism formula or trade gallon, no media settling/drainage correction.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledFilledRectangularPotLiters",
      label: "Modeled filled rectangular pot liters",
      kind: "number",
    },
    {
      id: "modeledTopInteriorAreaCm2",
      label: "Modeled top interior area cm2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      interiorBottomWidthCm: value.interiorBottomWidthCm as number,
      interiorBottomLengthCm: value.interiorBottomLengthCm as number,
      interiorTopWidthCm: value.interiorTopWidthCm as number,
      interiorTopLengthCm: value.interiorTopLengthCm as number,
      interiorPotHeightCm: value.interiorPotHeightCm as number,
      callerFillHeightCm: value.callerFillHeightCm as number,
    }),
});
export const run = tool.execute;
export default tool;
