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
  readonly interiorTopPotDiameterCm: number;
  readonly interiorBottomPotDiameterCm: number;
  readonly interiorPotHeightCm: number;
  readonly callerUnfilledHeadspaceCm: number;
}>;
export type Output = Readonly<{
  readonly modeledFilledPotLiters: number;
  readonly modeledTotalInteriorPotLiters: number;
}>;
const inputFields = [
  {
    id: "interiorTopPotDiameterCm",
    label: "Interior top pot diameter cm",
    kind: "number",
  },
  {
    id: "interiorBottomPotDiameterCm",
    label: "Interior bottom pot diameter cm",
    kind: "number",
  },
  {
    id: "interiorPotHeightCm",
    label: "Interior pot height cm",
    kind: "number",
  },
  {
    id: "callerUnfilledHeadspaceCm",
    label: "Caller unfilled headspace cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.interiorTopPotDiameterCm, "interiorTopPotDiameterCm");
  positive(input.interiorBottomPotDiameterCm, "interiorBottomPotDiameterCm");
  positive(input.interiorPotHeightCm, "interiorPotHeightCm");
  nonnegative(input.callerUnfilledHeadspaceCm, "callerUnfilledHeadspaceCm");
  if (input.callerUnfilledHeadspaceCm > input.interiorPotHeightCm)
    simpleError("headspace", "Headspace exceeds actual pot height.");
  const bottom = input.interiorBottomPotDiameterCm / 2,
    top = input.interiorTopPotDiameterCm / 2,
    h = input.interiorPotHeightCm,
    fill = h - input.callerUnfilledHeadspaceCm,
    r = bottom + (top - bottom) * (fill / h),
    volume = (height: number, radius: number) =>
      (((Math.PI * height) / 3) *
        (bottom * bottom + bottom * radius + radius * radius)) /
      1000;
  return {
    modeledFilledPotLiters: volume(fill, r),
    modeledTotalInteriorPotLiters: volume(h, top),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  interiorTopPotDiameterCm: 20,
  interiorBottomPotDiameterCm: 10,
  interiorPotHeightCm: 15,
  callerUnfilledHeadspaceCm: 3,
} satisfies Input;
export const exampleOutput = {
  modeledFilledPotLiters: 1.8975219627682351,
  modeledTotalInteriorPotLiters: 2.748893571891069,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/round-pot-volume-liter",
  title: "Round Pot Volume Liter Calculator",
  description:
    "Integrate actual tapered circular pot interior and caller headspace under straight-wall frustum geometry; not cylinder area alias, labeled nursery gallon, drainage displacement or media settling.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledFilledPotLiters",
      label: "Modeled filled pot liters",
      kind: "number",
    },
    {
      id: "modeledTotalInteriorPotLiters",
      label: "Modeled total interior pot liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      interiorTopPotDiameterCm: value.interiorTopPotDiameterCm as number,
      interiorBottomPotDiameterCm: value.interiorBottomPotDiameterCm as number,
      interiorPotHeightCm: value.interiorPotHeightCm as number,
      callerUnfilledHeadspaceCm: value.callerUnfilledHeadspaceCm as number,
    }),
});
export const run = tool.execute;
export default tool;
