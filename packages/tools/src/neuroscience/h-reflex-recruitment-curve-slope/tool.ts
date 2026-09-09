import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  nonnegative,
  strictlyIncreasing,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredStimulusCurrentsMa: readonly number[];
  readonly matchedQualifiedHreflexAmplitudesMv: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredStimulusCurrentsMa",
    label: "Independently measured stimulus currents ma",
    kind: "numberList",
  },
  {
    id: "matchedQualifiedHreflexAmplitudesMv",
    label: "Matched qualified hreflex amplitudes mv",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyMeasuredStimulusCurrentsMa,
    input.matchedQualifiedHreflexAmplitudesMv,
    "recruitment",
  );
  strictlyIncreasing(
    input.independentlyMeasuredStimulusCurrentsMa,
    "current",
    2,
  );
  input.independentlyMeasuredStimulusCurrentsMa.forEach((v) =>
    nonnegative(v, "current"),
  );
  input.matchedQualifiedHreflexAmplitudesMv.forEach((v) =>
    nonnegative(v, "amplitude"),
  );
  return {
    observedEndpointRecruitmentSlopeMvPerMa:
      (input.matchedQualifiedHreflexAmplitudesMv.at(-1)! -
        input.matchedQualifiedHreflexAmplitudesMv[0]) /
      (input.independentlyMeasuredStimulusCurrentsMa.at(-1)! -
        input.independentlyMeasuredStimulusCurrentsMa[0]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredStimulusCurrentsMa: [1, 2, 3],
    matchedQualifiedHreflexAmplitudesMv: [1, 3, 5],
  },
  output: { result: { observedEndpointRecruitmentSlopeMvPerMa: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/h-reflex-recruitment-curve-slope",
  title: "H-Reflex Recruitment Curve Slope Calculator",
  description:
    "Explicit endpoint H-reflex recruitment slope over an independently selected compatible monotone-current interval, not fitted entire sigmoid recruitment model or threshold inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
