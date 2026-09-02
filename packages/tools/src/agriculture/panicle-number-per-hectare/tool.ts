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
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedPanicleCounts: readonly number[];
  readonly sampleQuadratAreasM2: readonly number[];
  readonly callerExpansionWeights: readonly number[];
}>;
export type Output = Readonly<{ readonly expandedPaniclesPerHectare: number }>;
const inputFields = [
  {
    id: "observedPanicleCounts",
    label: "Observed panicle counts",
    kind: "numberList",
  },
  {
    id: "sampleQuadratAreasM2",
    label: "Sample quadrat areas m2",
    kind: "numberList",
  },
  {
    id: "callerExpansionWeights",
    label: "Caller expansion weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampleQuadratAreasM2.forEach((v) =>
    positive(v, "sampleQuadratAreasM2"),
  );
  input.callerExpansionWeights.forEach((v) =>
    positive(v, "callerExpansionWeights"),
  );
  input.observedPanicleCounts.forEach((v) =>
    nonnegative(v, "observedPanicleCounts"),
  );
  aligned(
    input.observedPanicleCounts,
    input.sampleQuadratAreasM2,
    "observedPanicleCounts",
  );
  aligned(
    input.observedPanicleCounts,
    input.callerExpansionWeights,
    "observedPanicleCounts",
  );
  input.observedPanicleCounts.forEach((v) => integer(v, "panicles"));
  return {
    expandedPaniclesPerHectare:
      (10000 *
        sum(
          input.observedPanicleCounts.map(
            (v, i) => v * input.callerExpansionWeights[i],
          ),
        )) /
      sum(
        input.sampleQuadratAreasM2.map(
          (v, i) => v * input.callerExpansionWeights[i],
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPanicleCounts: [10, 30],
  sampleQuadratAreasM2: [1, 2],
  callerExpansionWeights: [1, 2],
} satisfies Input;
export const exampleOutput = {
  expandedPaniclesPerHectare: 140000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/panicle-number-per-hectare",
  title: "Agriculture Panicle Number Per Hectare Calculator",
  description:
    "Survey-weighted actual quadrat panicle counts over weighted area, not stems-per-area unit conversion or inferred grain yield. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "expandedPaniclesPerHectare",
      label: "Expanded panicles per hectare",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPanicleCounts: value.observedPanicleCounts as readonly number[],
      sampleQuadratAreasM2: value.sampleQuadratAreasM2 as readonly number[],
      callerExpansionWeights: value.callerExpansionWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
