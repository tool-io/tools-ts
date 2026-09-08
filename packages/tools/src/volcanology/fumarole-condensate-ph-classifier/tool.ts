import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  ordered,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedCondensatePh: readonly number[];
  readonly callerVerifiedCondensatePhLower: readonly number[];
  readonly callerVerifiedCondensatePhUpper: readonly number[];
  readonly knownCondensatePhCriterionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownBandMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriterionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCondensatePh",
    label: "Observed condensate ph",
    kind: "numberList",
  },
  {
    id: "callerVerifiedCondensatePhLower",
    label: "Caller verified condensate ph lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedCondensatePhUpper",
    label: "Caller verified condensate ph upper",
    kind: "numberList",
  },
  {
    id: "knownCondensatePhCriterionFlags",
    label: "Known condensate ph criterion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownCondensatePhCriterionFlags,
    "knownCondensatePhCriterionFlags",
  );
  aligned(
    input.observedCondensatePh,
    input.callerVerifiedCondensatePhLower,
    "observedCondensatePh",
  );
  aligned(
    input.observedCondensatePh,
    input.callerVerifiedCondensatePhUpper,
    "observedCondensatePh",
  );
  aligned(
    input.observedCondensatePh,
    input.knownCondensatePhCriterionFlags,
    "observedCondensatePh",
  );
  input.callerVerifiedCondensatePhLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedCondensatePhUpper[i]),
  );
  return {
    signedKnownBandMargins: input.observedCondensatePh.map((v, i) =>
      input.knownCondensatePhCriterionFlags[i]
        ? Math.min(
            v - input.callerVerifiedCondensatePhLower[i],
            input.callerVerifiedCondensatePhUpper[i] - v,
          )
        : 0,
    ),
    knownReviewIndices: input.observedCondensatePh.flatMap((v, i) =>
      input.knownCondensatePhCriterionFlags[i] &&
      (v < input.callerVerifiedCondensatePhLower[i] ||
        v > input.callerVerifiedCondensatePhUpper[i])
        ? [i]
        : [],
    ),
    unknownCriterionIndices: input.knownCondensatePhCriterionFlags.flatMap(
      (v, i) => (!v ? [i] : []),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCondensatePh: [2, 5],
  callerVerifiedCondensatePhLower: [1, 1],
  callerVerifiedCondensatePhUpper: [3, 4],
  knownCondensatePhCriterionFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownBandMargins: [1, 0],
  knownReviewIndices: [],
  unknownCriterionIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/fumarole-condensate-ph-classifier",
  title: "Fumarole Condensate PH Acidity Classifier",
  description:
    "Audit actual fumarole condensate pH against independently verified method/temperature acidity bands, no health/instrument correction or corrosivity guarantee. Unknown criterion indices distinguish zero placeholders from known zero margins. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKnownBandMargins",
      label: "Signed known band margins",
      kind: "numberList",
    },
    {
      id: "knownReviewIndices",
      label: "Known review indices",
      kind: "numberList",
    },
    {
      id: "unknownCriterionIndices",
      label: "Unknown criterion indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCondensatePh: value.observedCondensatePh as readonly number[],
      callerVerifiedCondensatePhLower:
        value.callerVerifiedCondensatePhLower as readonly number[],
      callerVerifiedCondensatePhUpper:
        value.callerVerifiedCondensatePhUpper as readonly number[],
      knownCondensatePhCriterionFlags:
        value.knownCondensatePhCriterionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
