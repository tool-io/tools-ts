import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly componentEffectFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly predictedCombinedEffectFraction: number;
  readonly remainingUnaffectedFraction: number;
}>;
const inputFields = [
  {
    id: "componentEffectFractions",
    label: "Component effect fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.componentEffectFractions.length)
    simpleError(
      "componentEffectFractions",
      "Nonempty component effect fractions required.",
    );
  input.componentEffectFractions.forEach((v) =>
    fraction(v, "componentEffectFractions"),
  );
  const remainingUnaffectedFraction = input.componentEffectFractions.reduce(
    (s, v) => s * (1 - v),
    1,
  );
  return {
    predictedCombinedEffectFraction: 1 - remainingUnaffectedFraction,
    remainingUnaffectedFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  componentEffectFractions: [0.2, 0.3],
} satisfies Input;
export const exampleOutput = {
  predictedCombinedEffectFraction: 0.44,
  remainingUnaffectedFraction: 0.56,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/independent-action-mixture-response",
  title: "Independent Action Mixture",
  description:
    "Apply independent action as one minus the product of unaffected fractions; statistical independence and compatible effect definitions are caller assumptions.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedCombinedEffectFraction",
      label: "Predicted combined effect fraction",
      kind: "number",
    },
    {
      id: "remainingUnaffectedFraction",
      label: "Remaining unaffected fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      componentEffectFractions:
        value.componentEffectFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
