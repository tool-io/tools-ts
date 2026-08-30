import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly componentConcentrations: readonly number[];
  readonly componentEc50Values: readonly number[];
  readonly commonHillSlope: number;
}>;
export type Output = Readonly<{
  readonly summedEquivalentDose: number;
  readonly predictedMixtureEffectFraction: number;
}>;
const inputFields = [
  {
    id: "componentConcentrations",
    label: "Component concentrations",
    kind: "numberList",
  },
  {
    id: "componentEc50Values",
    label: "Component ec50 values",
    kind: "numberList",
  },
  { id: "commonHillSlope", label: "Common hill slope", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.componentConcentrations,
    input.componentEc50Values,
    "componentConcentrations",
  );
  input.componentConcentrations.forEach((v) =>
    nonnegative(v, "componentConcentrations"),
  );
  input.componentEc50Values.forEach((v) => positive(v, "componentEc50Values"));
  positive(input.commonHillSlope, "commonHillSlope");
  const summedEquivalentDose = input.componentConcentrations.reduce(
      (s, v, i) => s + v / input.componentEc50Values[i],
      0,
    ),
    power =
      summedEquivalentDose >= 1
        ? summedEquivalentDose ** -input.commonHillSlope
        : summedEquivalentDose ** input.commonHillSlope;
  return {
    summedEquivalentDose,
    predictedMixtureEffectFraction:
      summedEquivalentDose >= 1 ? 1 / (1 + power) : power / (1 + power),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  componentConcentrations: [1, 2],
  componentEc50Values: [2, 4],
  commonHillSlope: 2,
} satisfies Input;
export const exampleOutput = {
  summedEquivalentDose: 1,
  predictedMixtureEffectFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/hill-concentration-addition-mixture",
  title: "Concentration Addition Mixture",
  description:
    "Predict a concentration-addition mixture response under common-shape Hill curves from normalized component doses; assumes compatible endpoint and modes of action.",
  inputs: inputFields,
  outputs: [
    {
      id: "summedEquivalentDose",
      label: "Summed equivalent dose",
      kind: "number",
    },
    {
      id: "predictedMixtureEffectFraction",
      label: "Predicted mixture effect fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      componentConcentrations:
        value.componentConcentrations as readonly number[],
      componentEc50Values: value.componentEc50Values as readonly number[],
      commonHillSlope: value.commonHillSlope as number,
    }),
});
export const run = tool.execute;
export default tool;
