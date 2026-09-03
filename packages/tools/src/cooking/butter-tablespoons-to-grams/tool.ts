import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedButterTablespoonCount: number;
  readonly callerButterGramsPerTablespoon: number;
}>;
export type Output = Readonly<{ readonly butterMassG: number }>;
const inputFields = [
  {
    id: "observedButterTablespoonCount",
    label: "Observed butter tablespoon count",
    kind: "number",
  },
  {
    id: "callerButterGramsPerTablespoon",
    label: "Caller butter grams per tablespoon",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerButterGramsPerTablespoon,
    "callerButterGramsPerTablespoon",
  );
  nonnegative(
    input.observedButterTablespoonCount,
    "observedButterTablespoonCount",
  );
  return {
    butterMassG:
      input.observedButterTablespoonCount *
      input.callerButterGramsPerTablespoon,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedButterTablespoonCount: 2,
  callerButterGramsPerTablespoon: 25,
} satisfies Input;
export const exampleOutput = { butterMassG: 50 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/butter-tablespoons-to-grams",
  title: "Cooking Butter Tablespoons To Grams Calculator",
  description:
    "Explicit butter portion quantity and independently verified region/pack tablespoon mass, fractional portions supported; no universal stick/spoon size. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [{ id: "butterMassG", label: "Butter mass g", kind: "number" }],
  calculate: (value) =>
    calculate({
      observedButterTablespoonCount:
        value.observedButterTablespoonCount as number,
      callerButterGramsPerTablespoon:
        value.callerButterGramsPerTablespoon as number,
    }),
});
export const run = tool.execute;
export default tool;
