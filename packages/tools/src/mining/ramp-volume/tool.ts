import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedRampSectionAreaM2: readonly number[];
  readonly observedRampSegmentLengthsM: readonly number[];
  readonly observedExcludedRampVolumeM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly surveyedNetSegmentVolumesM3: readonly number[];
  readonly totalSurveyedNetVolumeM3: number;
}>;
const inputFields = [
  {
    id: "observedRampSectionAreaM2",
    label: "Observed ramp section area m2",
    kind: "numberList",
  },
  {
    id: "observedRampSegmentLengthsM",
    label: "Observed ramp segment lengths m",
    kind: "numberList",
  },
  {
    id: "observedExcludedRampVolumeM3",
    label: "Observed excluded ramp volume m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRampSegmentLengthsM.forEach((v) =>
    positive(v, "observedRampSegmentLengthsM"),
  );
  input.observedRampSectionAreaM2.forEach((v) =>
    nonnegative(v, "observedRampSectionAreaM2"),
  );
  input.observedExcludedRampVolumeM3.forEach((v) =>
    nonnegative(v, "observedExcludedRampVolumeM3"),
  );
  aligned(
    input.observedRampSectionAreaM2,
    input.observedRampSegmentLengthsM,
    "observedRampSectionAreaM2",
  );
  aligned(
    input.observedRampSectionAreaM2,
    input.observedExcludedRampVolumeM3,
    "observedRampSectionAreaM2",
  );
  const volumes = input.observedRampSectionAreaM2.map((v, i) => {
    const net =
      v * input.observedRampSegmentLengthsM[i] -
      input.observedExcludedRampVolumeM3[i];
    nonnegative(net, "net survey volume");
    return net;
  });
  return {
    surveyedNetSegmentVolumesM3: volumes,
    totalSurveyedNetVolumeM3: sum(volumes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRampSectionAreaM2: [2, 4],
  observedRampSegmentLengthsM: [3, 5],
  observedExcludedRampVolumeM3: [1, 2],
} satisfies Input;
export const exampleOutput = {
  surveyedNetSegmentVolumesM3: [5, 18],
  totalSurveyedNetVolumeM3: 23,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ramp-volume",
  title: "Ramp Volume Calculator",
  description:
    "Inventory actual independently surveyed piecewise-prismatic ramp sections with independently measured excluded void/material, not standard rectangular design dimensions or forecast geometry. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "surveyedNetSegmentVolumesM3",
      label: "Surveyed net segment volumes m3",
      kind: "numberList",
    },
    {
      id: "totalSurveyedNetVolumeM3",
      label: "Total surveyed net volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRampSectionAreaM2:
        value.observedRampSectionAreaM2 as readonly number[],
      observedRampSegmentLengthsM:
        value.observedRampSegmentLengthsM as readonly number[],
      observedExcludedRampVolumeM3:
        value.observedExcludedRampVolumeM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
