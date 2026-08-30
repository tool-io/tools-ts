import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly reelTurnCounts: readonly number[];
  readonly reelCircumferenceM: number;
  readonly unrecordedLeaderLengthsM: readonly number[];
  readonly measuredSlipFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly estimatedFilamentLengthsM: readonly number[];
  readonly meanFilamentLengthM: number;
}>;
const inputFields = [
  { id: "reelTurnCounts", label: "Reel turn counts", kind: "numberList" },
  { id: "reelCircumferenceM", label: "Reel circumference m", kind: "number" },
  {
    id: "unrecordedLeaderLengthsM",
    label: "Unrecorded leader lengths m",
    kind: "numberList",
  },
  {
    id: "measuredSlipFractions",
    label: "Measured slip fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.reelCircumferenceM, "reelCircumferenceM");
  input.unrecordedLeaderLengthsM.forEach((v) =>
    nonnegative(v, "unrecordedLeaderLengthsM"),
  );
  input.measuredSlipFractions.forEach((v) =>
    fraction(v, "measuredSlipFractions"),
  );
  input.reelTurnCounts.forEach((v) => count(v, "reelTurnCounts"));
  aligned(
    input.reelTurnCounts,
    input.unrecordedLeaderLengthsM,
    "reelTurnCounts",
  );
  aligned(input.reelTurnCounts, input.measuredSlipFractions, "reelTurnCounts");
  const estimatedFilamentLengthsM = input.reelTurnCounts.map(
    (v, i) =>
      v * input.reelCircumferenceM * (1 - input.measuredSlipFractions[i]) +
      input.unrecordedLeaderLengthsM[i],
  );
  return {
    estimatedFilamentLengthsM,
    meanFilamentLengthM: mean(estimatedFilamentLengthsM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  reelTurnCounts: [100, 200],
  reelCircumferenceM: 1,
  unrecordedLeaderLengthsM: [2, 3],
  measuredSlipFractions: [0.1, 0.2],
} satisfies Input;
export const exampleOutput = {
  estimatedFilamentLengthsM: [92, 163],
  meanFilamentLengthM: 127.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/filament-length-single-cocoon-meters",
  title: "Filament Length Single Cocoon Meters",
  description:
    "Estimate single-cocoon reeled filament lengths from turns/circumference with per-sample measured slip and unrecorded leader correction; distinct from mass/denier linear density.",
  inputs: inputFields,
  outputs: [
    {
      id: "estimatedFilamentLengthsM",
      label: "Estimated filament lengths m",
      kind: "numberList",
    },
    {
      id: "meanFilamentLengthM",
      label: "Mean filament length m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      reelTurnCounts: value.reelTurnCounts as readonly number[],
      reelCircumferenceM: value.reelCircumferenceM as number,
      unrecordedLeaderLengthsM:
        value.unrecordedLeaderLengthsM as readonly number[],
      measuredSlipFractions: value.measuredSlipFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
