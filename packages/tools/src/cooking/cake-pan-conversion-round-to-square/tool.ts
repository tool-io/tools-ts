import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly sourceRoundRadiusCm: number;
  readonly sourceFillHeightCm: number;
  readonly targetSquareSideCm: number;
  readonly targetFillHeightCm: number;
}>;
export type Output = Readonly<{
  readonly conditionalBatterVolumeScale: number;
}>;
const inputFields = [
  {
    id: "sourceRoundRadiusCm",
    label: "Source round radius cm",
    kind: "number",
  },
  { id: "sourceFillHeightCm", label: "Source fill height cm", kind: "number" },
  { id: "targetSquareSideCm", label: "Target square side cm", kind: "number" },
  { id: "targetFillHeightCm", label: "Target fill height cm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.sourceRoundRadiusCm, "sourceRoundRadiusCm");
  positive(input.sourceFillHeightCm, "sourceFillHeightCm");
  positive(input.targetSquareSideCm, "targetSquareSideCm");
  positive(input.targetFillHeightCm, "targetFillHeightCm");
  return {
    conditionalBatterVolumeScale:
      (input.targetSquareSideCm ** 2 * input.targetFillHeightCm) /
      (Math.PI * input.sourceRoundRadiusCm ** 2 * input.sourceFillHeightCm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sourceRoundRadiusCm: 10,
  sourceFillHeightCm: 4,
  targetSquareSideCm: 20,
  targetFillHeightCm: 3,
} satisfies Input;
export const exampleOutput = {
  conditionalBatterVolumeScale: 0.954929658551372,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/cake-pan-conversion-round-to-square",
  title: "Cooking Cake Pan Conversion Round To Square Calculator",
  description:
    "Round-to-square volume scaling with unequal explicit fill heights, not area-only baking time correction. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalBatterVolumeScale",
      label: "Conditional batter volume scale",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sourceRoundRadiusCm: value.sourceRoundRadiusCm as number,
      sourceFillHeightCm: value.sourceFillHeightCm as number,
      targetSquareSideCm: value.targetSquareSideCm as number,
      targetFillHeightCm: value.targetFillHeightCm as number,
    }),
});
export const run = tool.execute;
export default tool;
