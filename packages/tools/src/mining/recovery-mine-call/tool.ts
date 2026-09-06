import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMineCallRecoveryBaseline: readonly number[];
  readonly observedMineCallRecoveryAfter: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedMineCallRecoveryRatios: readonly number[];
  readonly signedMineCallRecoveryChanges: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMineCallRecoveryBaseline",
    label: "Observed mine call recovery baseline",
    kind: "numberList",
  },
  {
    id: "observedMineCallRecoveryAfter",
    label: "Observed mine call recovery after",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMineCallRecoveryBaseline.forEach((v) =>
    positive(v, "observedMineCallRecoveryBaseline"),
  );
  input.observedMineCallRecoveryAfter.forEach((v) =>
    nonnegative(v, "observedMineCallRecoveryAfter"),
  );
  aligned(
    input.observedMineCallRecoveryBaseline,
    input.observedMineCallRecoveryAfter,
    "observedMineCallRecoveryBaseline",
  );
  return {
    observedMineCallRecoveryRatios: input.observedMineCallRecoveryAfter.map(
      (v, i) => v / input.observedMineCallRecoveryBaseline[i],
    ),
    signedMineCallRecoveryChanges: input.observedMineCallRecoveryAfter.map(
      (v, i) => v - input.observedMineCallRecoveryBaseline[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMineCallRecoveryBaseline: [2, 4],
  observedMineCallRecoveryAfter: [3, 2],
} satisfies Input;
export const exampleOutput = {
  observedMineCallRecoveryRatios: [1.5, 0.5],
  signedMineCallRecoveryChanges: [1, -2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/recovery-mine-call",
  title: "Mine Call Recovery Calculator",
  description:
    "Compare actual independently called versus delivered matched dry ore rather than recovery-corrected contained-metal MCF. Signed reductions/increases retained. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMineCallRecoveryRatios",
      label: "Observed mine call recovery ratios",
      kind: "numberList",
    },
    {
      id: "signedMineCallRecoveryChanges",
      label: "Signed mine call recovery changes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMineCallRecoveryBaseline:
        value.observedMineCallRecoveryBaseline as readonly number[],
      observedMineCallRecoveryAfter:
        value.observedMineCallRecoveryAfter as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
