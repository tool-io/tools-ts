import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly coverCropClipWetMassKg: readonly number[];
  readonly matchedCoverCropDryFractions: readonly number[];
  readonly coverCropClipAreasM2: readonly number[];
  readonly callerClipExpansionWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedCoverCropDryBiomassKgHa: number;
}>;
const inputFields = [
  {
    id: "coverCropClipWetMassKg",
    label: "Cover crop clip wet mass kg",
    kind: "numberList",
  },
  {
    id: "matchedCoverCropDryFractions",
    label: "Matched cover crop dry fractions",
    kind: "numberList",
  },
  {
    id: "coverCropClipAreasM2",
    label: "Cover crop clip areas m2",
    kind: "numberList",
  },
  {
    id: "callerClipExpansionWeights",
    label: "Caller clip expansion weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.coverCropClipAreasM2.forEach((v) =>
    positive(v, "coverCropClipAreasM2"),
  );
  input.callerClipExpansionWeights.forEach((v) =>
    positive(v, "callerClipExpansionWeights"),
  );
  input.coverCropClipWetMassKg.forEach((v) =>
    nonnegative(v, "coverCropClipWetMassKg"),
  );
  input.matchedCoverCropDryFractions.forEach((v) =>
    fraction(v, "matchedCoverCropDryFractions"),
  );
  aligned(
    input.coverCropClipWetMassKg,
    input.matchedCoverCropDryFractions,
    "coverCropClipWetMassKg",
  );
  aligned(
    input.coverCropClipWetMassKg,
    input.coverCropClipAreasM2,
    "coverCropClipWetMassKg",
  );
  aligned(
    input.coverCropClipWetMassKg,
    input.callerClipExpansionWeights,
    "coverCropClipWetMassKg",
  );
  return {
    weightedCoverCropDryBiomassKgHa:
      (10000 *
        sum(
          input.coverCropClipWetMassKg.map(
            (v, i) =>
              v *
              input.matchedCoverCropDryFractions[i] *
              input.callerClipExpansionWeights[i],
          ),
        )) /
      sum(
        input.coverCropClipAreasM2.map(
          (v, i) => v * input.callerClipExpansionWeights[i],
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coverCropClipWetMassKg: [1, 2],
  matchedCoverCropDryFractions: [0.5, 0.25],
  coverCropClipAreasM2: [1, 2],
  callerClipExpansionWeights: [1, 2],
} satisfies Input;
export const exampleOutput = {
  weightedCoverCropDryBiomassKgHa: 3000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/cover-crop-biomass",
  title: "Agriculture Cover Crop Biomass Calculator",
  description:
    "Survey-weighted clipping dry-biomass estimates from unequal areas/paired dry fraction, not crop harvest yield. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "weightedCoverCropDryBiomassKgHa",
      label: "Weighted cover crop dry biomass kg ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      coverCropClipWetMassKg: value.coverCropClipWetMassKg as readonly number[],
      matchedCoverCropDryFractions:
        value.matchedCoverCropDryFractions as readonly number[],
      coverCropClipAreasM2: value.coverCropClipAreasM2 as readonly number[],
      callerClipExpansionWeights:
        value.callerClipExpansionWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
