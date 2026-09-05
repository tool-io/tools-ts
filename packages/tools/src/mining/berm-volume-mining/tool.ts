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
  readonly observedBermSectionAreaM2: readonly number[];
  readonly observedBermSegmentLengthsM: readonly number[];
  readonly observedExcludedBermVolumeM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly surveyedNetSegmentVolumesM3: readonly number[];
  readonly totalSurveyedNetVolumeM3: number;
}>;
const inputFields = [
  {
    id: "observedBermSectionAreaM2",
    label: "Observed berm section area m2",
    kind: "numberList",
  },
  {
    id: "observedBermSegmentLengthsM",
    label: "Observed berm segment lengths m",
    kind: "numberList",
  },
  {
    id: "observedExcludedBermVolumeM3",
    label: "Observed excluded berm volume m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBermSegmentLengthsM.forEach((v) =>
    positive(v, "observedBermSegmentLengthsM"),
  );
  input.observedBermSectionAreaM2.forEach((v) =>
    nonnegative(v, "observedBermSectionAreaM2"),
  );
  input.observedExcludedBermVolumeM3.forEach((v) =>
    nonnegative(v, "observedExcludedBermVolumeM3"),
  );
  aligned(
    input.observedBermSectionAreaM2,
    input.observedBermSegmentLengthsM,
    "observedBermSectionAreaM2",
  );
  aligned(
    input.observedBermSectionAreaM2,
    input.observedExcludedBermVolumeM3,
    "observedBermSectionAreaM2",
  );
  const volumes = input.observedBermSectionAreaM2.map((v, i) => {
    const net =
      v * input.observedBermSegmentLengthsM[i] -
      input.observedExcludedBermVolumeM3[i];
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
  observedBermSectionAreaM2: [2, 4],
  observedBermSegmentLengthsM: [3, 5],
  observedExcludedBermVolumeM3: [1, 2],
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
  id: "mining/berm-volume-mining",
  title: "Berm Volume Calculator",
  description:
    "Inventory actual independently surveyed piecewise-prismatic berm sections with independently measured excluded void/material, not standard rectangular design dimensions or forecast geometry. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedBermSectionAreaM2:
        value.observedBermSectionAreaM2 as readonly number[],
      observedBermSegmentLengthsM:
        value.observedBermSegmentLengthsM as readonly number[],
      observedExcludedBermVolumeM3:
        value.observedExcludedBermVolumeM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
