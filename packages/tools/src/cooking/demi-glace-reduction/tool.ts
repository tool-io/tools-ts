import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualInitialDemiGlaceVolume: number;
  readonly actualMeasuredFinalDemiGlaceVolume: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInitialDemiGlaceVolume",
    label: "Actual initial demi glace volume",
    kind: "number",
  },
  {
    id: "actualMeasuredFinalDemiGlaceVolume",
    label: "Actual measured final demi glace volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualInitialDemiGlaceVolume, "actualInitialDemiGlaceVolume");
  positive(
    input.actualMeasuredFinalDemiGlaceVolume,
    "actualMeasuredFinalDemiGlaceVolume",
  );
  return {
    value:
      input.actualInitialDemiGlaceVolume /
      input.actualMeasuredFinalDemiGlaceVolume,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInitialDemiGlaceVolume: 4,
    actualMeasuredFinalDemiGlaceVolume: 2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/demi-glace-reduction",
  title: "Cooking Demi Glace Reduction Calculator",
  description:
    "Actual volume concentration/reduction factor initial/final demi-glace, same temperature/units; not ethanol removal, evaporation prediction, recipe/done ness or food-safety judgment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
