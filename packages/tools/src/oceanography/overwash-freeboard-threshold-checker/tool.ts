import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedCrestElevationsM: readonly number[];
  readonly matchedStillWaterElevationsM: readonly number[];
  readonly callerIndependentlyEstablishedRunupM: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedRunupFreeboardMarginsM: readonly number[];
  readonly strictOverwashScreenIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCrestElevationsM",
    label: "Observed crest elevations m",
    kind: "numberList",
  },
  {
    id: "matchedStillWaterElevationsM",
    label: "Matched still water elevations m",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedRunupM",
    label: "Caller independently established runup m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIndependentlyEstablishedRunupM.forEach((v) =>
    nonnegative(v, "callerIndependentlyEstablishedRunupM"),
  );
  aligned(
    input.observedCrestElevationsM,
    input.matchedStillWaterElevationsM,
    "observedCrestElevationsM",
  );
  aligned(
    input.observedCrestElevationsM,
    input.callerIndependentlyEstablishedRunupM,
    "observedCrestElevationsM",
  );
  const m = input.observedCrestElevationsM.map(
    (v, i) =>
      v -
      input.matchedStillWaterElevationsM[i] -
      input.callerIndependentlyEstablishedRunupM[i],
  );
  return {
    signedRunupFreeboardMarginsM: m,
    strictOverwashScreenIndices: m.flatMap((v, i) => (v < 0 ? [i] : [])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCrestElevationsM: [3, 4],
  matchedStillWaterElevationsM: [2, 2],
  callerIndependentlyEstablishedRunupM: [2, 1],
} satisfies Input;
export const exampleOutput = {
  signedRunupFreeboardMarginsM: [-1, 1],
  strictOverwashScreenIndices: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/overwash-freeboard-threshold-checker",
  title: "Overwash Freeboard Threshold Checker",
  description:
    "Actual crest/water datum freeboard minus independent runup, negative exceedance retained; not overtopping discharge/hazard action. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedRunupFreeboardMarginsM",
      label: "Signed runup freeboard margins m",
      kind: "numberList",
    },
    {
      id: "strictOverwashScreenIndices",
      label: "Strict overwash screen indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCrestElevationsM:
        value.observedCrestElevationsM as readonly number[],
      matchedStillWaterElevationsM:
        value.matchedStillWaterElevationsM as readonly number[],
      callerIndependentlyEstablishedRunupM:
        value.callerIndependentlyEstablishedRunupM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
