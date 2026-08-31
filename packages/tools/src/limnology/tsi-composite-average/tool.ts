import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  binary,
  sum,
  weights,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly secchiPhosphorusChlorophyllTsi: readonly number[];
  readonly indexEvidenceFlags: readonly number[];
  readonly callerIndexWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly availableEvidenceCompositeTsi: number;
  readonly allThreeIndexEvidenceAvailable: boolean;
  readonly knownIndexWeightFraction: number;
  readonly maxObservedIndexDisagreement: number;
}>;
const inputFields = [
  {
    id: "secchiPhosphorusChlorophyllTsi",
    label: "Secchi phosphorus chlorophyll tsi",
    kind: "numberList",
  },
  {
    id: "indexEvidenceFlags",
    label: "Index evidence flags",
    kind: "numberList",
  },
  {
    id: "callerIndexWeights",
    label: "Caller index weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIndexWeights.forEach((v) => nonnegative(v, "callerIndexWeights"));
  binary(input.indexEvidenceFlags, "indexEvidenceFlags");
  if (
    input.secchiPhosphorusChlorophyllTsi.length !== 3 ||
    input.indexEvidenceFlags.length !== 3 ||
    input.callerIndexWeights.length !== 3
  )
    simpleError(
      "indices",
      "Exactly Secchi/P/chlorophyll values, evidence flags and weights required.",
    );
  const w = weights(input.callerIndexWeights),
    known = sum(w.filter((_, i) => input.indexEvidenceFlags[i] === 1)),
    values = input.secchiPhosphorusChlorophyllTsi.filter(
      (_, i) => input.indexEvidenceFlags[i] === 1,
    );
  if (!known)
    simpleError(
      "evidence",
      "At least one positive-weight observed index required.",
    );
  return {
    availableEvidenceCompositeTsi:
      sum(
        w.map(
          (v, i) =>
            v *
            input.indexEvidenceFlags[i] *
            input.secchiPhosphorusChlorophyllTsi[i],
        ),
      ) / known,
    allThreeIndexEvidenceAvailable: input.indexEvidenceFlags.every(
      (v) => v === 1,
    ),
    knownIndexWeightFraction: known,
    maxObservedIndexDisagreement: Math.max(...values) - Math.min(...values),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  secchiPhosphorusChlorophyllTsi: [40, 50, 60],
  indexEvidenceFlags: [1, 1, 0],
  callerIndexWeights: [1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  availableEvidenceCompositeTsi: 45,
  allThreeIndexEvidenceAvailable: false,
  knownIndexWeightFraction: 0.6666666666666666,
  maxObservedIndexDisagreement: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/tsi-composite-average",
  title: "TSI Composite Average Calculator",
  description:
    "Compute caller-requested diagnostic arithmetic of actual three Carlson indices with explicit weights, missing-evidence coverage and disagreement. NALMS cautions that averaging these indices is inappropriate for estimating algal biomass; prefer chlorophyll and examine index deviations. This is not a recommended ecological classifier or lake-state certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "availableEvidenceCompositeTsi",
      label: "Available evidence composite tsi",
      kind: "number",
    },
    {
      id: "allThreeIndexEvidenceAvailable",
      label: "All three index evidence available",
      kind: "boolean",
    },
    {
      id: "knownIndexWeightFraction",
      label: "Known index weight fraction",
      kind: "number",
    },
    {
      id: "maxObservedIndexDisagreement",
      label: "Max observed index disagreement",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      secchiPhosphorusChlorophyllTsi:
        value.secchiPhosphorusChlorophyllTsi as readonly number[],
      indexEvidenceFlags: value.indexEvidenceFlags as readonly number[],
      callerIndexWeights: value.callerIndexWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
