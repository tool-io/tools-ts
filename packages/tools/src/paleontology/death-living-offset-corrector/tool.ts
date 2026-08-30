import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  maximum,
  solve,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedDeathAssemblageCounts: readonly number[];
  readonly livingToDeathResponseMatrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly inferredLivingCommunityCounts: readonly number[];
  readonly reconstructedDeathCounts: readonly number[];
  readonly maximumAbsoluteReconstructionResidual: number;
}>;
const inputFields = [
  {
    id: "observedDeathAssemblageCounts",
    label: "Observed death assemblage counts",
    kind: "numberList",
  },
  {
    id: "livingToDeathResponseMatrix",
    label: "Living to death response matrix",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDeathAssemblageCounts.forEach((v) =>
    nonnegative(v, "observedDeathAssemblageCounts"),
  );
  input.livingToDeathResponseMatrix.forEach((row) =>
    row.forEach((v) => nonnegative(v, "response")),
  );
  const inferredLivingCommunityCounts = solve(
      input.livingToDeathResponseMatrix,
      input.observedDeathAssemblageCounts,
    ).map((v) => nonnegative(v, "inferredLivingCounts")),
    reconstructedDeathCounts = input.livingToDeathResponseMatrix.map((row) =>
      row.reduce((s, v, i) => s + v * inferredLivingCommunityCounts[i], 0),
    );
  return {
    inferredLivingCommunityCounts,
    reconstructedDeathCounts,
    maximumAbsoluteReconstructionResidual: maximum(
      reconstructedDeathCounts.map((v, i) =>
        Math.abs(v - input.observedDeathAssemblageCounts[i]),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDeathAssemblageCounts: [8, 6],
  livingToDeathResponseMatrix: [
    [1, 0.5],
    [0, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  inferredLivingCommunityCounts: [5, 6],
  reconstructedDeathCounts: [8, 6],
  maximumAbsoluteReconstructionResidual: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/death-living-offset-corrector",
  title: "Death Assemblage to Living Community Offset Corrector",
  description:
    "Invert a supplied identifiable nonnegative living-to-death preservation/mixing response and report reconstruction residual; negative physical solutions error rather than clipping, and response is not inferred from one assemblage.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredLivingCommunityCounts",
      label: "Inferred living community counts",
      kind: "numberList",
    },
    {
      id: "reconstructedDeathCounts",
      label: "Reconstructed death counts",
      kind: "numberList",
    },
    {
      id: "maximumAbsoluteReconstructionResidual",
      label: "Maximum absolute reconstruction residual",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDeathAssemblageCounts:
        value.observedDeathAssemblageCounts as readonly number[],
      livingToDeathResponseMatrix:
        value.livingToDeathResponseMatrix as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
