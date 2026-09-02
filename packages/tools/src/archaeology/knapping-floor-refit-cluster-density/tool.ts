import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedRefitClusterIds: readonly string[];
  readonly observedRefitFragmentCounts: readonly number[];
  readonly independentlySurveyedFloorAreaM2: number;
}>;
export type Output = Readonly<{
  readonly distinctObservedClusterCount: number;
  readonly observedClustersPerM2: number;
  readonly observedFragmentsPerM2: number;
}>;
const inputFields = [
  {
    id: "observedRefitClusterIds",
    label: "Observed refit cluster ids",
    kind: "stringList",
  },
  {
    id: "observedRefitFragmentCounts",
    label: "Observed refit fragment counts",
    kind: "numberList",
  },
  {
    id: "independentlySurveyedFloorAreaM2",
    label: "Independently surveyed floor area m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentlySurveyedFloorAreaM2,
    "independentlySurveyedFloorAreaM2",
  );
  input.observedRefitFragmentCounts.forEach((v) =>
    nonnegative(v, "observedRefitFragmentCounts"),
  );
  aligned(
    input.observedRefitClusterIds,
    input.observedRefitFragmentCounts,
    "observedRefitClusterIds",
  );
  input.observedRefitFragmentCounts.forEach((v) => integer(v, "fragments"));
  const n = new Set(input.observedRefitClusterIds).size;
  return {
    distinctObservedClusterCount: n,
    observedClustersPerM2: n / input.independentlySurveyedFloorAreaM2,
    observedFragmentsPerM2:
      sum(input.observedRefitFragmentCounts) /
      input.independentlySurveyedFloorAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRefitClusterIds: ["a", "b", "a"],
  observedRefitFragmentCounts: [2, 3, 4],
  independentlySurveyedFloorAreaM2: 3,
} satisfies Input;
export const exampleOutput = {
  distinctObservedClusterCount: 2,
  observedClustersPerM2: 0.6666666666666666,
  observedFragmentsPerM2: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/knapping-floor-refit-cluster-density",
  title: "Knapping Floor Refit Cluster Density Calculator",
  description:
    "Distinct independently identified knapping refit cluster footprint density and fragment density on actually surveyed floor area, notconjoingraphor assumed complete production event count. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "distinctObservedClusterCount",
      label: "Distinct observed cluster count",
      kind: "number",
    },
    {
      id: "observedClustersPerM2",
      label: "Observed clusters per m2",
      kind: "number",
    },
    {
      id: "observedFragmentsPerM2",
      label: "Observed fragments per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRefitClusterIds:
        value.observedRefitClusterIds as readonly string[],
      observedRefitFragmentCounts:
        value.observedRefitFragmentCounts as readonly number[],
      independentlySurveyedFloorAreaM2:
        value.independentlySurveyedFloorAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
