import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDominantHeightM: number;
  readonly observedStandAgeYears: number;
  readonly callerReferenceAgeYears: number;
  readonly callerHossfeldShapeA: number;
  readonly callerHossfeldShapeB: number;
  readonly callerHossfeldShapeC: number;
}>;
export type Output = Readonly<{
  readonly hossfeldNormalizedSiteHeightM: number;
}>;
const inputFields = [
  {
    id: "observedDominantHeightM",
    label: "Observed dominant height m",
    kind: "number",
  },
  {
    id: "observedStandAgeYears",
    label: "Observed stand age years",
    kind: "number",
  },
  {
    id: "callerReferenceAgeYears",
    label: "Caller reference age years",
    kind: "number",
  },
  {
    id: "callerHossfeldShapeA",
    label: "Caller hossfeld shape a",
    kind: "number",
  },
  {
    id: "callerHossfeldShapeB",
    label: "Caller hossfeld shape b",
    kind: "number",
  },
  {
    id: "callerHossfeldShapeC",
    label: "Caller hossfeld shape c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedDominantHeightM, "observedDominantHeightM");
  positive(input.observedStandAgeYears, "observedStandAgeYears");
  positive(input.callerReferenceAgeYears, "callerReferenceAgeYears");
  positive(input.callerHossfeldShapeA, "callerHossfeldShapeA");
  nonnegative(input.callerHossfeldShapeB, "callerHossfeldShapeB");
  nonnegative(input.callerHossfeldShapeC, "callerHossfeldShapeC");
  const h = (t: number) =>
    (t * t) /
    (input.callerHossfeldShapeA +
      input.callerHossfeldShapeB * t +
      input.callerHossfeldShapeC * t * t);
  return {
    hossfeldNormalizedSiteHeightM:
      (input.observedDominantHeightM * h(input.callerReferenceAgeYears)) /
      h(input.observedStandAgeYears),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDominantHeightM: 20,
  observedStandAgeYears: 20,
  callerReferenceAgeYears: 40,
  callerHossfeldShapeA: 100,
  callerHossfeldShapeB: 0,
  callerHossfeldShapeC: 1,
} satisfies Input;
export const exampleOutput = {
  hossfeldNormalizedSiteHeightM: 23.52941176470588,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/site-index-from-height-age",
  title: "Site Index From Height Age Calculator",
  description:
    "Explicit caller calibrated Hossfeld h(t)∝t²/(a+bt+ct²) reference-age normalization, distinct from existing Chapman–Richards site index, no universal species constants. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "hossfeldNormalizedSiteHeightM",
      label: "Hossfeld normalized site height m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDominantHeightM: value.observedDominantHeightM as number,
      observedStandAgeYears: value.observedStandAgeYears as number,
      callerReferenceAgeYears: value.callerReferenceAgeYears as number,
      callerHossfeldShapeA: value.callerHossfeldShapeA as number,
      callerHossfeldShapeB: value.callerHossfeldShapeB as number,
      callerHossfeldShapeC: value.callerHossfeldShapeC as number,
    }),
});
export const run = tool.execute;
export default tool;
