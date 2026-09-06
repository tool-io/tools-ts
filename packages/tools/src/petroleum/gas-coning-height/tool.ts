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
  readonly observedStaticGasContactDepthM: readonly number[];
  readonly observedProducingGasContactDepthM: readonly number[];
  readonly knownGasContactAssessmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownSignedConingHeightsM: readonly number[];
  readonly unknownContactCount: number;
}>;
const inputFields = [
  {
    id: "observedStaticGasContactDepthM",
    label: "Observed static gas contact depth m",
    kind: "numberList",
  },
  {
    id: "observedProducingGasContactDepthM",
    label: "Observed producing gas contact depth m",
    kind: "numberList",
  },
  {
    id: "knownGasContactAssessmentFlags",
    label: "Known gas contact assessment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedStaticGasContactDepthM.forEach((v) =>
    nonnegative(v, "observedStaticGasContactDepthM"),
  );
  input.observedProducingGasContactDepthM.forEach((v) =>
    nonnegative(v, "observedProducingGasContactDepthM"),
  );
  binary(
    input.knownGasContactAssessmentFlags,
    "knownGasContactAssessmentFlags",
  );
  aligned(
    input.observedStaticGasContactDepthM,
    input.observedProducingGasContactDepthM,
    "observedStaticGasContactDepthM",
  );
  aligned(
    input.observedStaticGasContactDepthM,
    input.knownGasContactAssessmentFlags,
    "observedStaticGasContactDepthM",
  );
  return {
    knownSignedConingHeightsM: input.observedStaticGasContactDepthM.flatMap(
      (v, i) =>
        input.knownGasContactAssessmentFlags[i]
          ? [-1 * (v - input.observedProducingGasContactDepthM[i])]
          : [],
    ),
    unknownContactCount: input.knownGasContactAssessmentFlags.filter((v) => !v)
      .length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStaticGasContactDepthM: [10, 20],
  observedProducingGasContactDepthM: [8, 19],
  knownGasContactAssessmentFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownSignedConingHeightsM: [-2],
  unknownContactCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/gas-coning-height",
  title: "Petroleum Gas Coning Height Calculator",
  description:
    "Audit actual independently observed gas static/producing contact shift in same downward-positive depth datum, positive convention=gas downward, negative retreat/unknown evidence retained; no coning prediction. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedStaticGasContactDepthM:
        value.observedStaticGasContactDepthM as readonly number[],
      observedProducingGasContactDepthM:
        value.observedProducingGasContactDepthM as readonly number[],
      knownGasContactAssessmentFlags:
        value.knownGasContactAssessmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
