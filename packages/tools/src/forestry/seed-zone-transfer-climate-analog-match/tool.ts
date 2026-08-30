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
  norm,
  shape,
} from "../shared.js";
export type Input = Readonly<{
  readonly targetClimateVector: readonly number[];
  readonly sourceClimateVectors: readonly (readonly number[])[];
  readonly comparisonScales: readonly number[];
  readonly callerMaximumStandardizedDistance: number;
}>;
export type Output = Readonly<{
  readonly sourceStandardizedClimateDistances: readonly number[];
  readonly compatibleClimateSourceFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "targetClimateVector",
    label: "Target climate vector",
    kind: "numberList",
  },
  {
    id: "sourceClimateVectors",
    label: "Source climate vectors",
    kind: "matrix",
  },
  { id: "comparisonScales", label: "Comparison scales", kind: "numberList" },
  {
    id: "callerMaximumStandardizedDistance",
    label: "Caller maximum standardized distance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.comparisonScales.forEach((v) => positive(v, "comparisonScales"));
  nonnegative(
    input.callerMaximumStandardizedDistance,
    "callerMaximumStandardizedDistance",
  );
  const m = shape(input.sourceClimateVectors, "sourceClimateVectors");
  if (
    m !== input.targetClimateVector.length ||
    m !== input.comparisonScales.length
  )
    simpleError(
      "climate",
      "Aligned target/source climate components and scales required.",
    );
  const sourceStandardizedClimateDistances = input.sourceClimateVectors.map(
    (row) =>
      norm(
        row.map(
          (v, i) =>
            (v - input.targetClimateVector[i]) / input.comparisonScales[i],
        ),
      ),
  );
  return {
    sourceStandardizedClimateDistances,
    compatibleClimateSourceFlags: sourceStandardizedClimateDistances.map((v) =>
      v <= input.callerMaximumStandardizedDistance ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetClimateVector: [10, 100],
  sourceClimateVectors: [
    [10, 100],
    [12, 120],
  ],
  comparisonScales: [1, 10],
  callerMaximumStandardizedDistance: 2,
} satisfies Input;
export const exampleOutput = {
  sourceStandardizedClimateDistances: [0, 2.8284271247461903],
  compatibleClimateSourceFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/seed-zone-transfer-climate-analog-match",
  title: "Seed Zone Climate Analog Match Tool",
  description:
    "Compare all caller climate analog vectors under explicit variable scales and distance cutoff, retaining ambiguous/no matches; no coordinates, seed-zone regulations or adaptive transfer suitability inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "sourceStandardizedClimateDistances",
      label: "Source standardized climate distances",
      kind: "numberList",
    },
    {
      id: "compatibleClimateSourceFlags",
      label: "Compatible climate source flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      targetClimateVector: value.targetClimateVector as readonly number[],
      sourceClimateVectors:
        value.sourceClimateVectors as readonly (readonly number[])[],
      comparisonScales: value.comparisonScales as readonly number[],
      callerMaximumStandardizedDistance:
        value.callerMaximumStandardizedDistance as number,
    }),
});
export const run = tool.execute;
export default tool;
