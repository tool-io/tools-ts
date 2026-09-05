import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly surveyCellAreasM2: readonly number[];
  readonly preSlideElevationsM: readonly number[];
  readonly postSlideElevationsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedRemovalM3: number;
  readonly observedAccumulationM3: number;
  readonly signedNetRemovalM3: number;
}>;
const inputFields = [
  {
    id: "surveyCellAreasM2",
    label: "Survey cell areas m2",
    kind: "numberList",
  },
  {
    id: "preSlideElevationsM",
    label: "Pre slide elevations m",
    kind: "numberList",
  },
  {
    id: "postSlideElevationsM",
    label: "Post slide elevations m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.surveyCellAreasM2.forEach((v) => positive(v, "surveyCellAreasM2"));
  aligned(
    input.surveyCellAreasM2,
    input.preSlideElevationsM,
    "surveyCellAreasM2",
  );
  aligned(
    input.surveyCellAreasM2,
    input.postSlideElevationsM,
    "surveyCellAreasM2",
  );
  const v = input.surveyCellAreasM2.map(
    (a, i) =>
      a * (input.preSlideElevationsM[i] - input.postSlideElevationsM[i]),
  );
  return {
    observedRemovalM3: sum(v.map((x) => Math.max(0, x))),
    observedAccumulationM3: sum(v.map((x) => Math.max(0, -x))),
    signedNetRemovalM3: sum(v),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  surveyCellAreasM2: [2, 3],
  preSlideElevationsM: [10, 20],
  postSlideElevationsM: [8, 21],
} satisfies Input;
export const exampleOutput = {
  observedRemovalM3: 4,
  observedAccumulationM3: 3,
  signedNetRemovalM3: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/landslide-volume",
  title: "Geology Landslide Volume Calculator",
  description:
    "Actual matched pre/post survey-cell removal AND deposition; overlapping cells excluded by caller, no depth×area proxy. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "observedRemovalM3", label: "Observed removal m3", kind: "number" },
    {
      id: "observedAccumulationM3",
      label: "Observed accumulation m3",
      kind: "number",
    },
    {
      id: "signedNetRemovalM3",
      label: "Signed net removal m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      surveyCellAreasM2: value.surveyCellAreasM2 as readonly number[],
      preSlideElevationsM: value.preSlideElevationsM as readonly number[],
      postSlideElevationsM: value.postSlideElevationsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
