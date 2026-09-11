import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  binary,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCandidateFrequenciesMHz: readonly number[];
  readonly independentlyVerifiedCandidateAllowedFlags: readonly number[];
  readonly callerMinimumPairSpacingMHz: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCandidateFrequenciesMHz",
    label: "Caller candidate frequencies m hz",
    kind: "numberList",
  },
  {
    id: "independentlyVerifiedCandidateAllowedFlags",
    label: "Independently verified candidate allowed flags",
    kind: "numberList",
  },
  {
    id: "callerMinimumPairSpacingMHz",
    label: "Caller minimum pair spacing m hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.callerCandidateFrequenciesMHz,
    input.independentlyVerifiedCandidateAllowedFlags,
    "candidates",
  );
  binary(input.independentlyVerifiedCandidateAllowedFlags, "allowed");
  input.callerCandidateFrequenciesMHz.forEach((v) => positive(v, "frequency"));
  positive(input.callerMinimumPairSpacingMHz, "spacing");
  const chosen: number[] = [];
  input.callerCandidateFrequenciesMHz.forEach((v, i) => {
    if (
      input.independentlyVerifiedCandidateAllowedFlags[i] &&
      chosen.every(
        (j) =>
          Math.abs(v - input.callerCandidateFrequenciesMHz[j]) >=
          input.callerMinimumPairSpacingMHz,
      )
    )
      chosen.push(i);
  });
  return {
    greedySelectedCandidateIndices: chosen,
    notSelectedCandidateIndices: input.callerCandidateFrequenciesMHz.flatMap(
      (_, i) => (chosen.includes(i) ? [] : [i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCandidateFrequenciesMHz: [100, 100.1, 100.3],
    independentlyVerifiedCandidateAllowedFlags: [1, 1, 1],
    callerMinimumPairSpacingMHz: 0.2,
  },
  output: {
    result: {
      greedySelectedCandidateIndices: [0, 2],
      notSelectedCandidateIndices: [1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/wireless-mic-frequency-coordination-plan-generator",
  title: "Wireless Mic Frequency Coordination Plan Generator",
  description:
    "Stable input-order greedy candidate pair-spacing screen using independently verified allowed-frequency flags. Not optimal spectrum allocation, intermodulation/occupancy analysis, licensed coordination or interference-free operation; no live radio changes.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
