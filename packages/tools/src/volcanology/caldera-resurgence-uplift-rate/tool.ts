import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  linearFit,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedResurgentSurveyTimesYears: readonly number[];
  readonly observedDomeRelativeElevationMm: readonly number[];
  readonly observedStableReferenceRelativeElevationMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly referenceCorrectedResurgenceMmYear: number;
  readonly referenceCorrectedTrendRSquared: number;
}>;
const inputFields = [
  {
    id: "observedResurgentSurveyTimesYears",
    label: "Observed resurgent survey times years",
    kind: "numberList",
  },
  {
    id: "observedDomeRelativeElevationMm",
    label: "Observed dome relative elevation mm",
    kind: "numberList",
  },
  {
    id: "observedStableReferenceRelativeElevationMm",
    label: "Observed stable reference relative elevation mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedResurgentSurveyTimesYears,
    input.observedDomeRelativeElevationMm,
    "observedResurgentSurveyTimesYears",
  );
  aligned(
    input.observedResurgentSurveyTimesYears,
    input.observedStableReferenceRelativeElevationMm,
    "observedResurgentSurveyTimesYears",
  );
  const f = linearFit(
    input.observedResurgentSurveyTimesYears,
    input.observedDomeRelativeElevationMm.map(
      (v, i) => v - input.observedStableReferenceRelativeElevationMm[i],
    ),
  );
  return {
    referenceCorrectedResurgenceMmYear: f.slope,
    referenceCorrectedTrendRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedResurgentSurveyTimesYears: [2000, 2001, 2003],
  observedDomeRelativeElevationMm: [0, 4, 12],
  observedStableReferenceRelativeElevationMm: [0, 1, 3],
} satisfies Input;
export const exampleOutput = {
  referenceCorrectedResurgenceMmYear: 3,
  referenceCorrectedTrendRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/caldera-resurgence-uplift-rate",
  title: "Caldera Resurgence Uplift Rate Calculator",
  description:
    "Actual dome versus independently matched stable-reference elevation changes over time, not geological source interpretation or geodesy transform. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "referenceCorrectedResurgenceMmYear",
      label: "Reference corrected resurgence mm year",
      kind: "number",
    },
    {
      id: "referenceCorrectedTrendRSquared",
      label: "Reference corrected trend r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedResurgentSurveyTimesYears:
        value.observedResurgentSurveyTimesYears as readonly number[],
      observedDomeRelativeElevationMm:
        value.observedDomeRelativeElevationMm as readonly number[],
      observedStableReferenceRelativeElevationMm:
        value.observedStableReferenceRelativeElevationMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
