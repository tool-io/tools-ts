import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly contactIntensityScore: number;
  readonly animalInfectionEvidenceScore: number;
  readonly scoreMatrix: readonly (readonly number[])[];
  readonly flagThreshold: number;
}>;
export type Output = Readonly<{
  readonly exposureScore: number;
  readonly aboveThreshold: boolean;
}>;
export const calculate = (input: Input): Output => {
  count(input.contactIntensityScore, "contactIntensityScore");
  count(input.animalInfectionEvidenceScore, "animalInfectionEvidenceScore");
  if (
    !input.scoreMatrix.length ||
    !input.scoreMatrix[0].length ||
    input.scoreMatrix.some(
      (row) => row.length !== input.scoreMatrix[0].length,
    ) ||
    input.contactIntensityScore >= input.scoreMatrix.length ||
    input.animalInfectionEvidenceScore >= input.scoreMatrix[0].length
  )
    simpleError(
      "scoreMatrix",
      "Rectangular score matrix and in-range category indexes required.",
    );
  const exposureScore =
    input.scoreMatrix[input.contactIntensityScore][
      input.animalInfectionEvidenceScore
    ];
  return {
    exposureScore,
    aboveThreshold: exposureScore >= input.flagThreshold,
  };
};
export const exampleInput = {
  contactIntensityScore: 2,
  animalInfectionEvidenceScore: 1,
  scoreMatrix: [
    [0, 1, 2],
    [1, 2, 3],
    [2, 3, 4],
  ],
  flagThreshold: 3,
} satisfies Input;
export const exampleOutput = {
  exposureScore: 3,
  aboveThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/animal-exposure-score-matrix",
  title: "Animal Exposure Score Matrix",
  description:
    "Resolve an animal-contact exposure score from a caller-defined matrix; not an infection prediction.",
  inputs: [
    {
      id: "contactIntensityScore",
      label: "Contact intensity score",
      kind: "integer",
    },
    {
      id: "animalInfectionEvidenceScore",
      label: "Animal infection evidence score",
      kind: "integer",
    },
    { id: "scoreMatrix", label: "Score matrix", kind: "matrix" },
    { id: "flagThreshold", label: "Flag threshold", kind: "number" },
  ],
  outputs: [
    { id: "exposureScore", label: "Exposure score", kind: "number" },
    { id: "aboveThreshold", label: "Above threshold", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      contactIntensityScore: value.contactIntensityScore as number,
      animalInfectionEvidenceScore:
        value.animalInfectionEvidenceScore as number,
      scoreMatrix: value.scoreMatrix as readonly (readonly number[])[],
      flagThreshold: value.flagThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
