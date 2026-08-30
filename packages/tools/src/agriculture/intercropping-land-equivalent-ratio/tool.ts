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
  readonly intercropYieldsPerTotalLandArea: readonly number[];
  readonly comparableSoleCropYieldsPerLandArea: readonly number[];
}>;
export type Output = Readonly<{
  readonly partialLandEquivalentRatios: readonly number[];
  readonly landEquivalentRatio: number;
  readonly equivalentSoleLandSavingFraction: number;
}>;
const inputFields = [
  {
    id: "intercropYieldsPerTotalLandArea",
    label: "Intercrop yields per total land area",
    kind: "numberList",
  },
  {
    id: "comparableSoleCropYieldsPerLandArea",
    label: "Comparable sole crop yields per land area",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.comparableSoleCropYieldsPerLandArea.forEach((v) =>
    positive(v, "comparableSoleCropYieldsPerLandArea"),
  );
  input.intercropYieldsPerTotalLandArea.forEach((v) =>
    nonnegative(v, "intercropYieldsPerTotalLandArea"),
  );
  aligned(
    input.intercropYieldsPerTotalLandArea,
    input.comparableSoleCropYieldsPerLandArea,
    "intercropYieldsPerTotalLandArea",
  );
  const partialLandEquivalentRatios = input.intercropYieldsPerTotalLandArea.map(
      (v, i) => v / input.comparableSoleCropYieldsPerLandArea[i],
    ),
    landEquivalentRatio = positive(
      partialLandEquivalentRatios.reduce((a, b) => a + b, 0),
      "landEquivalentRatio",
    );
  return {
    partialLandEquivalentRatios,
    landEquivalentRatio,
    equivalentSoleLandSavingFraction: 1 - 1 / landEquivalentRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  intercropYieldsPerTotalLandArea: [2, 3],
  comparableSoleCropYieldsPerLandArea: [4, 4],
} satisfies Input;
export const exampleOutput = {
  partialLandEquivalentRatios: [0.5, 0.75],
  landEquivalentRatio: 1.25,
  equivalentSoleLandSavingFraction: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/intercropping-land-equivalent-ratio",
  title: "Agriculture Intercropping Land Equivalent Ratio",
  description:
    "Sum partial crop land-equivalent ratios on matched full intercrop-land denominators and report signed equivalent sole-land saving; no duplicate alternate LER route or inferred economic/ecological preference.",
  inputs: inputFields,
  outputs: [
    {
      id: "partialLandEquivalentRatios",
      label: "Partial land equivalent ratios",
      kind: "numberList",
    },
    {
      id: "landEquivalentRatio",
      label: "Land equivalent ratio",
      kind: "number",
    },
    {
      id: "equivalentSoleLandSavingFraction",
      label: "Equivalent sole land saving fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      intercropYieldsPerTotalLandArea:
        value.intercropYieldsPerTotalLandArea as readonly number[],
      comparableSoleCropYieldsPerLandArea:
        value.comparableSoleCropYieldsPerLandArea as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
