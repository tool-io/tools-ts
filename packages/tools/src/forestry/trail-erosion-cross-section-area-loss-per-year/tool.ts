import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  integral,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCrossSectionStationM: readonly number[];
  readonly observedBeforeTrailSurfaceM: readonly number[];
  readonly observedAfterTrailSurfaceM: readonly number[];
  readonly observedSurveyIntervalYears: number;
}>;
export type Output = Readonly<{
  readonly signedCrossSectionLossM2: number;
  readonly signedCrossSectionLossM2PerYear: number;
}>;
const inputFields = [
  {
    id: "observedCrossSectionStationM",
    label: "Observed cross section station m",
    kind: "numberList",
  },
  {
    id: "observedBeforeTrailSurfaceM",
    label: "Observed before trail surface m",
    kind: "numberList",
  },
  {
    id: "observedAfterTrailSurfaceM",
    label: "Observed after trail surface m",
    kind: "numberList",
  },
  {
    id: "observedSurveyIntervalYears",
    label: "Observed survey interval years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedSurveyIntervalYears, "observedSurveyIntervalYears");
  aligned(
    input.observedBeforeTrailSurfaceM,
    input.observedAfterTrailSurfaceM,
    "survey",
  );
  const loss = integral(
    input.observedCrossSectionStationM,
    input.observedBeforeTrailSurfaceM.map(
      (v, i) => v - input.observedAfterTrailSurfaceM[i],
    ),
  );
  return {
    signedCrossSectionLossM2: loss,
    signedCrossSectionLossM2PerYear: loss / input.observedSurveyIntervalYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCrossSectionStationM: [0, 1, 2],
  observedBeforeTrailSurfaceM: [1, 1, 1],
  observedAfterTrailSurfaceM: [0.5, 0.5, 0.5],
  observedSurveyIntervalYears: 2,
} satisfies Input;
export const exampleOutput = {
  signedCrossSectionLossM2: 0.9999999999999999,
  signedCrossSectionLossM2PerYear: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/trail-erosion-cross-section-area-loss-per-year",
  title: "Trail Erosion Cross-Section Loss Per Year",
  description:
    "Integrate actual matched trail cross-section surface change over unequal stations/time, signed deposition retained; no spatial geodesy, erosion causality or rate beyond survey. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCrossSectionLossM2",
      label: "Signed cross section loss m2",
      kind: "number",
    },
    {
      id: "signedCrossSectionLossM2PerYear",
      label: "Signed cross section loss m2 per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCrossSectionStationM:
        value.observedCrossSectionStationM as readonly number[],
      observedBeforeTrailSurfaceM:
        value.observedBeforeTrailSurfaceM as readonly number[],
      observedAfterTrailSurfaceM:
        value.observedAfterTrailSurfaceM as readonly number[],
      observedSurveyIntervalYears: value.observedSurveyIntervalYears as number,
    }),
});
export const run = tool.execute;
export default tool;
