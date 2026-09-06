import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedIndividualWaveHeightsM: readonly number[];
  readonly matchedSignificantWaveHeightsM: readonly number[];
  readonly callerRogueHeightMultiple: number;
}>;
export type Output = Readonly<{
  readonly individualHeightToHsRatios: readonly number[];
  readonly strictRogueCriterionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedIndividualWaveHeightsM",
    label: "Observed individual wave heights m",
    kind: "numberList",
  },
  {
    id: "matchedSignificantWaveHeightsM",
    label: "Matched significant wave heights m",
    kind: "numberList",
  },
  {
    id: "callerRogueHeightMultiple",
    label: "Caller rogue height multiple",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedSignificantWaveHeightsM.forEach((v) =>
    positive(v, "matchedSignificantWaveHeightsM"),
  );
  positive(input.callerRogueHeightMultiple, "callerRogueHeightMultiple");
  input.observedIndividualWaveHeightsM.forEach((v) =>
    nonnegative(v, "observedIndividualWaveHeightsM"),
  );
  aligned(
    input.observedIndividualWaveHeightsM,
    input.matchedSignificantWaveHeightsM,
    "observedIndividualWaveHeightsM",
  );
  const ratios = input.observedIndividualWaveHeightsM.map(
    (v, i) => v / input.matchedSignificantWaveHeightsM[i],
  );
  return {
    individualHeightToHsRatios: ratios,
    strictRogueCriterionIndices: ratios.flatMap((v, i) =>
      v > input.callerRogueHeightMultiple ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIndividualWaveHeightsM: [1, 3, 5],
  matchedSignificantWaveHeightsM: [1, 2, 2],
  callerRogueHeightMultiple: 2,
} satisfies Input;
export const exampleOutput = {
  individualHeightToHsRatios: [1, 1.5, 2.5],
  strictRogueCriterionIndices: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/rogue-wave-threshold-significant-checker",
  title: "Rogue Wave Threshold Significant Checker",
  description:
    "Match actual individual wave height to same-windowHs and caller strict criterion, inclusive equality excluded, no crest-height substitution or navigation safety. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "individualHeightToHsRatios",
      label: "Individual height to hs ratios",
      kind: "numberList",
    },
    {
      id: "strictRogueCriterionIndices",
      label: "Strict rogue criterion indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIndividualWaveHeightsM:
        value.observedIndividualWaveHeightsM as readonly number[],
      matchedSignificantWaveHeightsM:
        value.matchedSignificantWaveHeightsM as readonly number[],
      callerRogueHeightMultiple: value.callerRogueHeightMultiple as number,
    }),
});
export const run = tool.execute;
export default tool;
