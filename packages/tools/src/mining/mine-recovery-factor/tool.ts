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
  readonly observedMineStageRecoveryBaseline: readonly number[];
  readonly observedMineStageRecoveryAfter: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedMineStageRecoveryRatios: readonly number[];
  readonly signedMineStageRecoveryChanges: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMineStageRecoveryBaseline",
    label: "Observed mine stage recovery baseline",
    kind: "numberList",
  },
  {
    id: "observedMineStageRecoveryAfter",
    label: "Observed mine stage recovery after",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMineStageRecoveryBaseline.forEach((v) =>
    positive(v, "observedMineStageRecoveryBaseline"),
  );
  input.observedMineStageRecoveryAfter.forEach((v) =>
    nonnegative(v, "observedMineStageRecoveryAfter"),
  );
  aligned(
    input.observedMineStageRecoveryBaseline,
    input.observedMineStageRecoveryAfter,
    "observedMineStageRecoveryBaseline",
  );
  return {
    observedMineStageRecoveryRatios: input.observedMineStageRecoveryAfter.map(
      (v, i) => v / input.observedMineStageRecoveryBaseline[i],
    ),
    signedMineStageRecoveryChanges: input.observedMineStageRecoveryAfter.map(
      (v, i) => v - input.observedMineStageRecoveryBaseline[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMineStageRecoveryBaseline: [2, 4],
  observedMineStageRecoveryAfter: [3, 2],
} satisfies Input;
export const exampleOutput = {
  observedMineStageRecoveryRatios: [1.5, 0.5],
  signedMineStageRecoveryChanges: [1, -2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/mine-recovery-factor",
  title: "Mine Recovery Factor Calculator",
  description:
    "Compare actual matched mining-stage inlet/outlet dry ore inventories, stage boundaries explicit. Signed reductions/increases retained. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMineStageRecoveryRatios",
      label: "Observed mine stage recovery ratios",
      kind: "numberList",
    },
    {
      id: "signedMineStageRecoveryChanges",
      label: "Signed mine stage recovery changes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMineStageRecoveryBaseline:
        value.observedMineStageRecoveryBaseline as readonly number[],
      observedMineStageRecoveryAfter:
        value.observedMineStageRecoveryAfter as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
