import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedStaticWaterContactDepthM: readonly number[];
  readonly observedProducingWaterContactDepthM: readonly number[];
  readonly knownWaterContactAssessmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownSignedConingHeightsM: readonly number[];
  readonly unknownContactCount: number;
}>;
const inputFields = [
  {
    id: "observedStaticWaterContactDepthM",
    label: "Observed static water contact depth m",
    kind: "numberList",
  },
  {
    id: "observedProducingWaterContactDepthM",
    label: "Observed producing water contact depth m",
    kind: "numberList",
  },
  {
    id: "knownWaterContactAssessmentFlags",
    label: "Known water contact assessment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedStaticWaterContactDepthM.forEach((v) =>
    nonnegative(v, "observedStaticWaterContactDepthM"),
  );
  input.observedProducingWaterContactDepthM.forEach((v) =>
    nonnegative(v, "observedProducingWaterContactDepthM"),
  );
  binary(
    input.knownWaterContactAssessmentFlags,
    "knownWaterContactAssessmentFlags",
  );
  aligned(
    input.observedStaticWaterContactDepthM,
    input.observedProducingWaterContactDepthM,
    "observedStaticWaterContactDepthM",
  );
  aligned(
    input.observedStaticWaterContactDepthM,
    input.knownWaterContactAssessmentFlags,
    "observedStaticWaterContactDepthM",
  );
  return {
    knownSignedConingHeightsM: input.observedStaticWaterContactDepthM.flatMap(
      (v, i) =>
        input.knownWaterContactAssessmentFlags[i]
          ? [1 * (v - input.observedProducingWaterContactDepthM[i])]
          : [],
    ),
    unknownContactCount: input.knownWaterContactAssessmentFlags.filter(
      (v) => !v,
    ).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStaticWaterContactDepthM: [10, 20],
  observedProducingWaterContactDepthM: [8, 19],
  knownWaterContactAssessmentFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownSignedConingHeightsM: [2],
  unknownContactCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/water-coning-height",
  title: "Petroleum Water Coning Height Calculator",
  description:
    "Audit actual independently observed water static/producing contact shift in same downward-positive depth datum, positive convention=water upward, negative retreat/unknown evidence retained; no coning prediction. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownSignedConingHeightsM",
      label: "Known signed coning heights m",
      kind: "numberList",
    },
    {
      id: "unknownContactCount",
      label: "Unknown contact count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStaticWaterContactDepthM:
        value.observedStaticWaterContactDepthM as readonly number[],
      observedProducingWaterContactDepthM:
        value.observedProducingWaterContactDepthM as readonly number[],
      knownWaterContactAssessmentFlags:
        value.knownWaterContactAssessmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
