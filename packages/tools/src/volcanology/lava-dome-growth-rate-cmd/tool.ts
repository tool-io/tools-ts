import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedDomeSurveyTimesDays: readonly number[];
  readonly observedMatchedDomeVolumesM3: readonly number[];
  readonly callerIndependentUnrelatedSurfaceChangesM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly correctedIntervalDomeGrowthM3Day: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDomeSurveyTimesDays",
    label: "Observed dome survey times days",
    kind: "numberList",
  },
  {
    id: "observedMatchedDomeVolumesM3",
    label: "Observed matched dome volumes m3",
    kind: "numberList",
  },
  {
    id: "callerIndependentUnrelatedSurfaceChangesM3",
    label: "Caller independent unrelated surface changes m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedDomeSurveyTimesDays,
    input.observedMatchedDomeVolumesM3,
    "surveys",
  );
  strictlyIncreasing(input.observedDomeSurveyTimesDays, "time");
  if (
    input.callerIndependentUnrelatedSurfaceChangesM3.length !==
    input.observedDomeSurveyTimesDays.length - 1
  )
    simpleError("changes", "One independent correction per survey interval.");
  input.observedMatchedDomeVolumesM3.forEach((v) => nonnegative(v, "volume"));
  return {
    correctedIntervalDomeGrowthM3Day: input.observedDomeSurveyTimesDays
      .slice(1)
      .map(
        (t, i) =>
          (input.observedMatchedDomeVolumesM3[i + 1] -
            input.observedMatchedDomeVolumesM3[i] -
            input.callerIndependentUnrelatedSurfaceChangesM3[i]) /
          (t - input.observedDomeSurveyTimesDays[i]),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDomeSurveyTimesDays: [0, 1, 3],
  observedMatchedDomeVolumesM3: [100, 110, 150],
  callerIndependentUnrelatedSurfaceChangesM3: [2, -2],
} satisfies Input;
export const exampleOutput = {
  correctedIntervalDomeGrowthM3Day: [8, 21],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/lava-dome-growth-rate-cmd",
  title: "Lava Dome Growth Rate CMD Calculator",
  description:
    "Actual repeated dome surveys corrected for independently established unrelated surface changes, signed shrinkage retained, not eruption flux forecast. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedIntervalDomeGrowthM3Day",
      label: "Corrected interval dome growth m3 day",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDomeSurveyTimesDays:
        value.observedDomeSurveyTimesDays as readonly number[],
      observedMatchedDomeVolumesM3:
        value.observedMatchedDomeVolumesM3 as readonly number[],
      callerIndependentUnrelatedSurfaceChangesM3:
        value.callerIndependentUnrelatedSurfaceChangesM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
