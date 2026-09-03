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
  fraction,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedOriginalCoconutCreamTargetMassG: number;
  readonly originalFatFraction: number;
  readonly replacementFatFraction: number;
  readonly originalWaterFraction: number;
  readonly replacementWaterFraction: number;
}>;
export type Output = Readonly<{
  readonly fatMatchedReplacementMassG: number;
  readonly signedWaterChangeG: number;
}>;
const inputFields = [
  {
    id: "observedOriginalCoconutCreamTargetMassG",
    label: "Observed original coconut cream target mass g",
    kind: "number",
  },
  { id: "originalFatFraction", label: "Original fat fraction", kind: "number" },
  {
    id: "replacementFatFraction",
    label: "Replacement fat fraction",
    kind: "number",
  },
  {
    id: "originalWaterFraction",
    label: "Original water fraction",
    kind: "number",
  },
  {
    id: "replacementWaterFraction",
    label: "Replacement water fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.replacementFatFraction, "replacementFatFraction");
  nonnegative(
    input.observedOriginalCoconutCreamTargetMassG,
    "observedOriginalCoconutCreamTargetMassG",
  );
  fraction(input.originalFatFraction, "originalFatFraction");
  fraction(input.replacementFatFraction, "replacementFatFraction");
  fraction(input.originalWaterFraction, "originalWaterFraction");
  fraction(input.replacementWaterFraction, "replacementWaterFraction");
  if (
    input.originalFatFraction + input.originalWaterFraction > 1 ||
    input.replacementFatFraction + input.replacementWaterFraction > 1
  )
    simpleError("composition", "Fat+water≤1per ingredient.");
  const m =
    (input.observedOriginalCoconutCreamTargetMassG *
      input.originalFatFraction) /
    input.replacementFatFraction;
  return {
    fatMatchedReplacementMassG: m,
    signedWaterChangeG:
      m * input.replacementWaterFraction -
      input.observedOriginalCoconutCreamTargetMassG *
        input.originalWaterFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOriginalCoconutCreamTargetMassG: 100,
  originalFatFraction: 0.1,
  replacementFatFraction: 0.2,
  originalWaterFraction: 0.8,
  replacementWaterFraction: 0.6,
} satisfies Input;
export const exampleOutput = {
  fatMatchedReplacementMassG: 50,
  signedWaterChangeG: -50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/cream-coconut-substitution",
  title: "Cooking Cream Coconut Substitution Calculator",
  description:
    "Conditional fat-matched CoconutCream substitution with separately assayed water change; protein/emulsion/baking behavior not asserted. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "fatMatchedReplacementMassG",
      label: "Fat matched replacement mass g",
      kind: "number",
    },
    {
      id: "signedWaterChangeG",
      label: "Signed water change g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOriginalCoconutCreamTargetMassG:
        value.observedOriginalCoconutCreamTargetMassG as number,
      originalFatFraction: value.originalFatFraction as number,
      replacementFatFraction: value.replacementFatFraction as number,
      originalWaterFraction: value.originalWaterFraction as number,
      replacementWaterFraction: value.replacementWaterFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
