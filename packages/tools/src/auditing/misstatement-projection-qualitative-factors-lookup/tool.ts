import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QualitativeProjectionInput = {
  readonly factorWeights: ReadonlyArray<number>;
  readonly overallFactor: number;
  readonly presentFactorWeights: ReadonlyArray<number>;
  readonly quantitativeProjection: number;
};

export type QualitativeProjectionOutput = {
  readonly adjustedProjection: number;
  readonly presentWeightSum: number;
};

export const applyQualitativeProjectionFactors = (
  input: QualitativeProjectionInput,
): QualitativeProjectionOutput => {
  if (
    !Number.isFinite(input.quantitativeProjection) ||
    input.quantitativeProjection < 0
  )
    simpleError(
      "quantitativeProjection",
      "Quantitative projection must be finite and nonnegative.",
      "invalid_quantitative_projection",
    );
  if (
    !Number.isFinite(input.overallFactor) ||
    input.overallFactor < 0 ||
    input.overallFactor > 1
  )
    simpleError(
      "overallFactor",
      "Overall factor must be from 0 through 1.",
      "invalid_overall_factor",
    );
  if (
    !Array.isArray(input.factorWeights) ||
    !Array.isArray(input.presentFactorWeights)
  )
    simpleError(
      "",
      "Factor and present-weight values must be arrays.",
      "factor_data_required",
    );
  if (input.factorWeights.length !== input.presentFactorWeights.length)
    simpleError(
      "presentFactorWeights",
      "Each factor must have one present-weight value.",
      "factor_data_length_mismatch",
    );
  let presentWeightSum = 0;
  for (const [index, factorWeight] of input.factorWeights.entries()) {
    const presentWeight = input.presentFactorWeights[index]!;
    for (const [field, value] of [
      [`factorWeights.${index}`, factorWeight],
      [`presentFactorWeights.${index}`, presentWeight],
    ] as const)
      if (!Number.isFinite(value) || value < 0 || value > 1)
        simpleError(
          field,
          "Factor weights must be from 0 through 1.",
          "invalid_factor_weight",
        );
    presentWeightSum += presentWeight;
    if (!Number.isFinite(presentWeightSum))
      simpleError(
        `presentFactorWeights.${index}`,
        "The present-weight sum is not finite.",
        "result_not_finite",
      );
  }
  const adjustedProjection =
    input.quantitativeProjection * input.overallFactor * (1 + presentWeightSum);
  if (!Number.isFinite(adjustedProjection))
    simpleError(
      "quantitativeProjection",
      "The adjusted projection is not finite.",
      "result_not_finite",
    );
  return { adjustedProjection, presentWeightSum };
};

export const qualitativeProjectionExample = {
  input: {
    factorWeights: [0.1, 0.2, 0.3],
    overallFactor: 0.8,
    presentFactorWeights: [1, 0, 0.5],
    quantitativeProjection: 100_000,
  },
  output: { adjustedProjection: 200_000, presentWeightSum: 1.5 },
} satisfies ToolExample<
  QualitativeProjectionInput,
  QualitativeProjectionOutput
>;

export const qualitativeProjectionTool = createSimpleTool({
  calculate: (input) =>
    applyQualitativeProjectionFactors({
      factorWeights: input.factorWeights as number[],
      overallFactor: input.overallFactor as number,
      presentFactorWeights: input.presentFactorWeights as number[],
      quantitativeProjection: input.quantitativeProjection as number,
    }),
  description:
    "Adjust a quantitative misstatement projection by an overall factor and the supplied sum of present qualitative-factor weights.",
  id: "auditing/misstatement-projection-qualitative-factors-lookup",
  inputs: [
    {
      description: "Potential qualitative-factor weights from 0 through 1.",
      id: "factorWeights",
      kind: "numberList",
      label: "Factor weights",
    },
    {
      description: "Overall projection multiplier from 0 through 1.",
      id: "overallFactor",
      kind: "number",
      label: "Overall factor",
      maximum: 1,
      minimum: 0,
    },
    {
      description:
        "Weight selected for each factor when that factor is present.",
      id: "presentFactorWeights",
      kind: "numberList",
      label: "Present factor weights",
    },
    {
      description: "Initial quantitative misstatement projection.",
      id: "quantitativeProjection",
      kind: "number",
      label: "Quantitative projection",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "adjustedProjection",
      kind: "number",
      label: "Adjusted projection",
      minimum: 0,
    },
    {
      id: "presentWeightSum",
      kind: "number",
      label: "Present weight sum",
      minimum: 0,
    },
  ],
  title: "Misstatement Projection Qualitative Factors Lookup",
});

export const runQualitativeProjection = qualitativeProjectionTool.execute;
export default qualitativeProjectionTool;
