import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedButterStickCount: number;
  readonly callerButterGramsPerStick: number;
}>;
export type Output = Readonly<{ readonly butterMassG: number }>;
const inputFields = [
  {
    id: "observedButterStickCount",
    label: "Observed butter stick count",
    kind: "number",
  },
  {
    id: "callerButterGramsPerStick",
    label: "Caller butter grams per stick",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerButterGramsPerStick, "callerButterGramsPerStick");
  nonnegative(input.observedButterStickCount, "observedButterStickCount");
  return {
    butterMassG:
      input.observedButterStickCount * input.callerButterGramsPerStick,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedButterStickCount: 2,
  callerButterGramsPerStick: 25,
} satisfies Input;
export const exampleOutput = { butterMassG: 50 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/butter-sticks-to-grams",
  title: "Cooking Butter Sticks To Grams Calculator",
  description:
    "Explicit butter portion quantity and independently verified region/pack stick mass, fractional portions supported; no universal stick/spoon size. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [{ id: "butterMassG", label: "Butter mass g", kind: "number" }],
  calculate: (value) =>
    calculate({
      observedButterStickCount: value.observedButterStickCount as number,
      callerButterGramsPerStick: value.callerButterGramsPerStick as number,
    }),
});
export const run = tool.execute;
export default tool;
