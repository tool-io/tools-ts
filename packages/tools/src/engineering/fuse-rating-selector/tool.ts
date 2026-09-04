import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFuseIds: readonly string[];
  readonly callerVerifiedContinuousRatingsA: readonly number[];
  readonly callerVerifiedInterruptRatingsA: readonly number[];
  readonly observedContinuousDemandA: number;
  readonly callerIndependentlyEstablishedFaultA: number;
}>;
export type Output = Readonly<{
  readonly matchingCallerFuseIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerVerifiedFuseIds",
    label: "Caller verified fuse ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedContinuousRatingsA",
    label: "Caller verified continuous ratings a",
    kind: "numberList",
  },
  {
    id: "callerVerifiedInterruptRatingsA",
    label: "Caller verified interrupt ratings a",
    kind: "numberList",
  },
  {
    id: "observedContinuousDemandA",
    label: "Observed continuous demand a",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedFaultA",
    label: "Caller independently established fault a",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedContinuousRatingsA.forEach((v) =>
    nonnegative(v, "callerVerifiedContinuousRatingsA"),
  );
  input.callerVerifiedInterruptRatingsA.forEach((v) =>
    nonnegative(v, "callerVerifiedInterruptRatingsA"),
  );
  nonnegative(input.observedContinuousDemandA, "observedContinuousDemandA");
  nonnegative(
    input.callerIndependentlyEstablishedFaultA,
    "callerIndependentlyEstablishedFaultA",
  );
  aligned(
    input.callerVerifiedFuseIds,
    input.callerVerifiedContinuousRatingsA,
    "callerVerifiedFuseIds",
  );
  aligned(
    input.callerVerifiedFuseIds,
    input.callerVerifiedInterruptRatingsA,
    "callerVerifiedFuseIds",
  );
  unique(input.callerVerifiedFuseIds, "fuses");
  return {
    matchingCallerFuseIds: input.callerVerifiedFuseIds.filter(
      (_, i) =>
        input.callerVerifiedContinuousRatingsA[i] >=
          input.observedContinuousDemandA &&
        input.callerVerifiedInterruptRatingsA[i] >=
          input.callerIndependentlyEstablishedFaultA,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFuseIds: ["a", "b"],
  callerVerifiedContinuousRatingsA: [10, 20],
  callerVerifiedInterruptRatingsA: [100, 200],
  observedContinuousDemandA: 15,
  callerIndependentlyEstablishedFaultA: 150,
} satisfies Input;
export const exampleOutput = { matchingCallerFuseIds: ["b"] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/fuse-rating-selector",
  title: "Fuse Rating Selector",
  description:
    "Screen independently verified continuous AND interrupt ratings; not automatic wiring, time-current coordination or fuse approval. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchingCallerFuseIds",
      label: "Matching caller fuse ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedFuseIds: value.callerVerifiedFuseIds as readonly string[],
      callerVerifiedContinuousRatingsA:
        value.callerVerifiedContinuousRatingsA as readonly number[],
      callerVerifiedInterruptRatingsA:
        value.callerVerifiedInterruptRatingsA as readonly number[],
      observedContinuousDemandA: value.observedContinuousDemandA as number,
      callerIndependentlyEstablishedFaultA:
        value.callerIndependentlyEstablishedFaultA as number,
    }),
});
export const run = tool.execute;
export default tool;
