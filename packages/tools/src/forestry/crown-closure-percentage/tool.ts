import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSkyOccludedFlags: readonly number[];
  readonly observedSolidAngleWeights: readonly number[];
  readonly knownSkyAssessmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownSolidAngleCrownClosureFraction: number;
  readonly unassessedSolidAngleFraction: number;
}>;
const inputFields = [
  {
    id: "observedSkyOccludedFlags",
    label: "Observed sky occluded flags",
    kind: "numberList",
  },
  {
    id: "observedSolidAngleWeights",
    label: "Observed solid angle weights",
    kind: "numberList",
  },
  {
    id: "knownSkyAssessmentFlags",
    label: "Known sky assessment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSolidAngleWeights.forEach((v) =>
    nonnegative(v, "observedSolidAngleWeights"),
  );
  binary(input.observedSkyOccludedFlags, "observedSkyOccludedFlags");
  binary(input.knownSkyAssessmentFlags, "knownSkyAssessmentFlags");
  aligned(
    input.observedSkyOccludedFlags,
    input.observedSolidAngleWeights,
    "observedSkyOccludedFlags",
  );
  aligned(
    input.observedSkyOccludedFlags,
    input.knownSkyAssessmentFlags,
    "observedSkyOccludedFlags",
  );
  const total = sum(input.observedSolidAngleWeights),
    known = sum(
      input.observedSolidAngleWeights.filter(
        (_, i) => input.knownSkyAssessmentFlags[i],
      ),
    );
  positive(total, "total");
  positive(known, "known");
  return {
    knownSolidAngleCrownClosureFraction:
      sum(
        input.observedSolidAngleWeights.filter(
          (_, i) =>
            input.knownSkyAssessmentFlags[i] &&
            input.observedSkyOccludedFlags[i],
        ),
      ) / known,
    unassessedSolidAngleFraction: (total - known) / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSkyOccludedFlags: [1, 0, 1],
  observedSolidAngleWeights: [1, 2, 1],
  knownSkyAssessmentFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  knownSolidAngleCrownClosureFraction: 0.3333333333333333,
  unassessedSolidAngleFraction: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/crown-closure-percentage",
  title: "Crown Closure Percentage Calculator",
  description:
    "Audit actual solid-angle sky closure with weighted assessed/unassessed hemispherical samples, not projected canopy ground area or gap fraction alone. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownSolidAngleCrownClosureFraction",
      label: "Known solid angle crown closure fraction",
      kind: "number",
    },
    {
      id: "unassessedSolidAngleFraction",
      label: "Unassessed solid angle fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSkyOccludedFlags:
        value.observedSkyOccludedFlags as readonly number[],
      observedSolidAngleWeights:
        value.observedSolidAngleWeights as readonly number[],
      knownSkyAssessmentFlags:
        value.knownSkyAssessmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
