import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly originalWhiteFlourG: number;
  readonly callerWholeWheatReplacementFraction: number;
  readonly independentWhiteAbsorptionGPerG: number;
  readonly independentWholeWheatAbsorptionGPerG: number;
}>;
export type Output = Readonly<{
  readonly replacementWholeWheatG: number;
  readonly retainedWhiteG: number;
  readonly conditionalExtraWaterG: number;
}>;
const inputFields = [
  {
    id: "originalWhiteFlourG",
    label: "Original white flour g",
    kind: "number",
  },
  {
    id: "callerWholeWheatReplacementFraction",
    label: "Caller whole wheat replacement fraction",
    kind: "number",
  },
  {
    id: "independentWhiteAbsorptionGPerG",
    label: "Independent white absorption g per g",
    kind: "number",
  },
  {
    id: "independentWholeWheatAbsorptionGPerG",
    label: "Independent whole wheat absorption g per g",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.originalWhiteFlourG, "originalWhiteFlourG");
  nonnegative(
    input.independentWhiteAbsorptionGPerG,
    "independentWhiteAbsorptionGPerG",
  );
  nonnegative(
    input.independentWholeWheatAbsorptionGPerG,
    "independentWholeWheatAbsorptionGPerG",
  );
  fraction(
    input.callerWholeWheatReplacementFraction,
    "callerWholeWheatReplacementFraction",
  );
  const r =
    input.originalWhiteFlourG * input.callerWholeWheatReplacementFraction;
  return {
    replacementWholeWheatG: r,
    retainedWhiteG: input.originalWhiteFlourG - r,
    conditionalExtraWaterG:
      r *
      (input.independentWholeWheatAbsorptionGPerG -
        input.independentWhiteAbsorptionGPerG),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  originalWhiteFlourG: 100,
  callerWholeWheatReplacementFraction: 0.5,
  independentWhiteAbsorptionGPerG: 0.6,
  independentWholeWheatAbsorptionGPerG: 0.8,
} satisfies Input;
export const exampleOutput = {
  replacementWholeWheatG: 50,
  retainedWhiteG: 50,
  conditionalExtraWaterG: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/flour-whole-wheat-to-white-substitution",
  title: "Cooking Flour Whole Wheat To White Substitution Calculator",
  description:
    "White/whole-wheat replacement inventory with separately measured water absorption change, signed if lower; not nominal hydration duplication or nutrition claim. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "replacementWholeWheatG",
      label: "Replacement whole wheat g",
      kind: "number",
    },
    { id: "retainedWhiteG", label: "Retained white g", kind: "number" },
    {
      id: "conditionalExtraWaterG",
      label: "Conditional extra water g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      originalWhiteFlourG: value.originalWhiteFlourG as number,
      callerWholeWheatReplacementFraction:
        value.callerWholeWheatReplacementFraction as number,
      independentWhiteAbsorptionGPerG:
        value.independentWhiteAbsorptionGPerG as number,
      independentWholeWheatAbsorptionGPerG:
        value.independentWholeWheatAbsorptionGPerG as number,
    }),
});
export const run = tool.execute;
export default tool;
