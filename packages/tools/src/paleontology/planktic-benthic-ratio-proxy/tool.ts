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
  fraction,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly plankticTestCount: number;
  readonly benthicTestCount: number;
  readonly plankticRecoveryProbability: number;
  readonly benthicRecoveryProbability: number;
  readonly callerRatioProxyBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly recoveryAdjustedPlankticBenthicRatio: number;
  readonly recoveryAdjustedPlankticFraction: number;
  readonly withinCallerProxyBand: boolean;
}>;
const inputFields = [
  { id: "plankticTestCount", label: "Planktic test count", kind: "integer" },
  { id: "benthicTestCount", label: "Benthic test count", kind: "integer" },
  {
    id: "plankticRecoveryProbability",
    label: "Planktic recovery probability",
    kind: "number",
  },
  {
    id: "benthicRecoveryProbability",
    label: "Benthic recovery probability",
    kind: "number",
  },
  {
    id: "callerRatioProxyBounds",
    label: "Caller ratio proxy bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.benthicTestCount, "benthicTestCount");
  positive(input.plankticRecoveryProbability, "plankticRecoveryProbability");
  positive(input.benthicRecoveryProbability, "benthicRecoveryProbability");
  input.callerRatioProxyBounds.forEach((v) =>
    nonnegative(v, "callerRatioProxyBounds"),
  );
  fraction(input.plankticRecoveryProbability, "plankticRecoveryProbability");
  fraction(input.benthicRecoveryProbability, "benthicRecoveryProbability");
  count(input.plankticTestCount, "plankticTestCount");
  count(input.benthicTestCount, "benthicTestCount");
  if (
    input.callerRatioProxyBounds.length !== 2 ||
    input.callerRatioProxyBounds[0] > input.callerRatioProxyBounds[1]
  )
    simpleError("bounds", "Ordered two-value caller proxy band required.");
  const p = input.plankticTestCount / input.plankticRecoveryProbability,
    b = input.benthicTestCount / input.benthicRecoveryProbability,
    recoveryAdjustedPlankticBenthicRatio = p / b;
  return {
    recoveryAdjustedPlankticBenthicRatio,
    recoveryAdjustedPlankticFraction: p / (p + b),
    withinCallerProxyBand:
      recoveryAdjustedPlankticBenthicRatio >= input.callerRatioProxyBounds[0] &&
      recoveryAdjustedPlankticBenthicRatio <= input.callerRatioProxyBounds[1],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plankticTestCount: 20,
  benthicTestCount: 10,
  plankticRecoveryProbability: 0.5,
  benthicRecoveryProbability: 1,
  callerRatioProxyBounds: [2, 5],
} satisfies Input;
export const exampleOutput = {
  recoveryAdjustedPlankticBenthicRatio: 4,
  recoveryAdjustedPlankticFraction: 0.8,
  withinCallerProxyBand: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/planktic-benthic-ratio-proxy",
  title: "Planktonic-Benthic Ratio Productivity Proxy",
  description:
    "Correct planktic/benthic observed test counts for caller differential recovery and screen a ratio band; ratio is not a unique productivity or water-depth estimator.",
  inputs: inputFields,
  outputs: [
    {
      id: "recoveryAdjustedPlankticBenthicRatio",
      label: "Recovery adjusted planktic benthic ratio",
      kind: "number",
    },
    {
      id: "recoveryAdjustedPlankticFraction",
      label: "Recovery adjusted planktic fraction",
      kind: "number",
    },
    {
      id: "withinCallerProxyBand",
      label: "Within caller proxy band",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      plankticTestCount: value.plankticTestCount as number,
      benthicTestCount: value.benthicTestCount as number,
      plankticRecoveryProbability: value.plankticRecoveryProbability as number,
      benthicRecoveryProbability: value.benthicRecoveryProbability as number,
      callerRatioProxyBounds: value.callerRatioProxyBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
