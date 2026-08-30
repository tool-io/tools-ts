import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly habitatComponentSuitabilityScores: readonly number[];
  readonly componentWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedGeometricHabitatIndex: number;
  readonly limitingComponentScore: number;
}>;
const inputFields = [
  {
    id: "habitatComponentSuitabilityScores",
    label: "Habitat component suitability scores",
    kind: "numberList",
  },
  { id: "componentWeights", label: "Component weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.componentWeights.forEach((v) => positive(v, "componentWeights"));
  input.habitatComponentSuitabilityScores.forEach((v) =>
    fraction(v, "habitatComponentSuitabilityScores"),
  );
  aligned(
    input.habitatComponentSuitabilityScores,
    input.componentWeights,
    "habitatComponentSuitabilityScores",
  );
  const total = input.componentWeights.reduce((a, b) => a + b, 0),
    zero = input.habitatComponentSuitabilityScores.some((v) => v === 0);
  return {
    weightedGeometricHabitatIndex: zero
      ? 0
      : Math.exp(
          input.habitatComponentSuitabilityScores.reduce(
            (s, v, i) => s + (Math.log(v) * input.componentWeights[i]) / total,
            0,
          ),
        ),
    limitingComponentScore: minimum(input.habitatComponentSuitabilityScores),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  habitatComponentSuitabilityScores: [0.25, 1],
  componentWeights: [1, 1],
} satisfies Input;
export const exampleOutput = {
  weightedGeometricHabitatIndex: 0.5,
  limitingComponentScore: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/habitat-suitability-indexhsi-snag-dependent-wildlife",
  title: "Snag Wildlife HSI",
  description:
    "Aggregate caller independently calibrated snag-habitat component scores by weighted geometric mean, retaining limiting zero components; not species presence probability or validated habitat suitability.",
  inputs: inputFields,
  outputs: [
    {
      id: "weightedGeometricHabitatIndex",
      label: "Weighted geometric habitat index",
      kind: "number",
    },
    {
      id: "limitingComponentScore",
      label: "Limiting component score",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      habitatComponentSuitabilityScores:
        value.habitatComponentSuitabilityScores as readonly number[],
      componentWeights: value.componentWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
