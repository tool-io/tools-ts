import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  shape,
  calculateMahalanobisDistance,
} from "../shared.js";
export type Input = Readonly<{
  readonly sampleLeadIsotopeRatios: readonly number[];
  readonly sourceMeanRatioVectors: readonly (readonly number[])[];
  readonly combinedCovariance: readonly (readonly number[])[];
  readonly callerMaximumSquaredDistance: number;
}>;
export type Output = Readonly<{
  readonly sourceSquaredMahalanobisDistances: readonly number[];
  readonly compatibleSourceFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "sampleLeadIsotopeRatios",
    label: "Sample lead isotope ratios",
    kind: "numberList",
  },
  {
    id: "sourceMeanRatioVectors",
    label: "Source mean ratio vectors",
    kind: "matrix",
  },
  { id: "combinedCovariance", label: "Combined covariance", kind: "matrix" },
  {
    id: "callerMaximumSquaredDistance",
    label: "Caller maximum squared distance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMaximumSquaredDistance,
    "callerMaximumSquaredDistance",
  );
  if (shape(input.sourceMeanRatioVectors, "sourceMeanRatioVectors") > 16)
    simpleError(
      "sourceMeanRatioVectors",
      "At most 16 isotope ratios supported per source.",
    );
  const sourceSquaredMahalanobisDistances = input.sourceMeanRatioVectors.map(
    (vector) => {
      aligned(vector, input.sampleLeadIsotopeRatios, "ratios");
      vector.forEach((v) => positive(v, "sourceMeanRatioVectors"));
      input.sampleLeadIsotopeRatios.forEach((v) =>
        positive(v, "sampleLeadIsotopeRatios"),
      );
      const r = calculateMahalanobisDistance({
        vector: input.sampleLeadIsotopeRatios,
        mean: vector,
        covariance: input.combinedCovariance,
      });
      if (!r.ok)
        return simpleError(
          "combinedCovariance",
          "Positive-definite compatible combined covariance required.",
        );
      return r.output.squaredDistance;
    },
  );
  return {
    sourceSquaredMahalanobisDistances,
    compatibleSourceFlags: sourceSquaredMahalanobisDistances.map((v) =>
      v <= input.callerMaximumSquaredDistance ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleLeadIsotopeRatios: [1, 2],
  sourceMeanRatioVectors: [
    [1, 2],
    [3, 2],
  ],
  combinedCovariance: [
    [1, 0],
    [0, 1],
  ],
  callerMaximumSquaredDistance: 1,
} satisfies Input;
export const exampleOutput = {
  sourceSquaredMahalanobisDistances: [0, 4],
  compatibleSourceFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/lead-isotope-ratio-source",
  title: "Lead Isotope Ratio Source Tool",
  description:
    "Screen all caller lead-source multivariate baselines using reused Mahalanobis distance and combined covariance; retains ambiguous/no matches, without simple ratio aliases or source identification.",
  inputs: inputFields,
  outputs: [
    {
      id: "sourceSquaredMahalanobisDistances",
      label: "Source squared mahalanobis distances",
      kind: "numberList",
    },
    {
      id: "compatibleSourceFlags",
      label: "Compatible source flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleLeadIsotopeRatios:
        value.sampleLeadIsotopeRatios as readonly number[],
      sourceMeanRatioVectors:
        value.sourceMeanRatioVectors as readonly (readonly number[])[],
      combinedCovariance:
        value.combinedCovariance as readonly (readonly number[])[],
      callerMaximumSquaredDistance:
        value.callerMaximumSquaredDistance as number,
    }),
});
export const run = tool.execute;
export default tool;
