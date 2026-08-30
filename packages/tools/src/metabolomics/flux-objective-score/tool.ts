import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly reactionFluxes: readonly number[];
  readonly objectiveCoefficients: readonly number[];
  readonly minimumObjective: number;
}>;
export type Output = Readonly<{
  readonly objectiveValue: number;
  readonly meetsTarget: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.reactionFluxes.length === 0 ||
    input.reactionFluxes.length !== input.objectiveCoefficients.length
  )
    simpleError(
      "reactionFluxes",
      "Aligned objective coefficients and reaction fluxes required.",
    );
  const objectiveValue = input.reactionFluxes.reduce(
    (s, v, i) => s + v * input.objectiveCoefficients[i],
    0,
  );
  return {
    objectiveValue,
    meetsTarget: objectiveValue >= input.minimumObjective,
  };
};
export const exampleInput = {
  reactionFluxes: [2, 3],
  objectiveCoefficients: [1, 2],
  minimumObjective: 7,
} satisfies Input;
export const exampleOutput = {
  objectiveValue: 8,
  meetsTarget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/flux-objective-score",
  title: "Flux Objective Score",
  description: "Evaluate a caller-supplied flux-balance objective function.",
  inputs: [
    { id: "reactionFluxes", kind: "numberList", label: "Reaction fluxes" },
    {
      id: "objectiveCoefficients",
      kind: "numberList",
      label: "Objective coefficients",
    },
    { id: "minimumObjective", kind: "number", label: "Minimum objective" },
  ],
  outputs: [
    { id: "objectiveValue", kind: "number", label: "Objective value" },
    { id: "meetsTarget", kind: "boolean", label: "Meets target" },
  ],
  calculate: (value) =>
    calculate({
      reactionFluxes: value.reactionFluxes as readonly number[],
      objectiveCoefficients: value.objectiveCoefficients as readonly number[],
      minimumObjective: value.minimumObjective as number,
    }),
});
export const run = tool.execute;
export default tool;
