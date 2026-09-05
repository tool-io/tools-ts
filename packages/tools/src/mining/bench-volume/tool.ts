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
  readonly observedBenchSectionAreaM2: readonly number[];
  readonly observedBenchSegmentLengthsM: readonly number[];
  readonly observedExcludedBenchVolumeM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly surveyedNetSegmentVolumesM3: readonly number[];
  readonly totalSurveyedNetVolumeM3: number;
}>;
const inputFields = [
  {
    id: "observedBenchSectionAreaM2",
    label: "Observed bench section area m2",
    kind: "numberList",
  },
  {
    id: "observedBenchSegmentLengthsM",
    label: "Observed bench segment lengths m",
    kind: "numberList",
  },
  {
    id: "observedExcludedBenchVolumeM3",
    label: "Observed excluded bench volume m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBenchSegmentLengthsM.forEach((v) =>
    positive(v, "observedBenchSegmentLengthsM"),
  );
  input.observedBenchSectionAreaM2.forEach((v) =>
    nonnegative(v, "observedBenchSectionAreaM2"),
  );
  input.observedExcludedBenchVolumeM3.forEach((v) =>
    nonnegative(v, "observedExcludedBenchVolumeM3"),
  );
  aligned(
    input.observedBenchSectionAreaM2,
    input.observedBenchSegmentLengthsM,
    "observedBenchSectionAreaM2",
  );
  aligned(
    input.observedBenchSectionAreaM2,
    input.observedExcludedBenchVolumeM3,
    "observedBenchSectionAreaM2",
  );
  const volumes = input.observedBenchSectionAreaM2.map((v, i) => {
    const net =
      v * input.observedBenchSegmentLengthsM[i] -
      input.observedExcludedBenchVolumeM3[i];
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
  observedBenchSectionAreaM2: [2, 4],
  observedBenchSegmentLengthsM: [3, 5],
  observedExcludedBenchVolumeM3: [1, 2],
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
  id: "mining/bench-volume",
  title: "Bench Volume Calculator",
  description:
    "Inventory actual independently surveyed piecewise-prismatic bench sections with independently measured excluded void/material, not standard rectangular design dimensions or forecast geometry. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedBenchSectionAreaM2:
        value.observedBenchSectionAreaM2 as readonly number[],
      observedBenchSegmentLengthsM:
        value.observedBenchSegmentLengthsM as readonly number[],
      observedExcludedBenchVolumeM3:
        value.observedExcludedBenchVolumeM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
