import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerRmrIncludingOriginalGroundwater: readonly number[];
  readonly callerOriginalGroundwaterRating: readonly number[];
  readonly callerIndependentlyReassessedGroundwaterRating: readonly number[];
}>;
export type Output = Readonly<{
  readonly groundwaterReconciledRmr: readonly number[];
}>;
const inputFields = [
  {
    id: "callerRmrIncludingOriginalGroundwater",
    label: "Caller rmr including original groundwater",
    kind: "numberList",
  },
  {
    id: "callerOriginalGroundwaterRating",
    label: "Caller original groundwater rating",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyReassessedGroundwaterRating",
    label: "Caller independently reassessed groundwater rating",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  for (const v of [
    input.callerRmrIncludingOriginalGroundwater,
    input.callerOriginalGroundwaterRating,
    input.callerIndependentlyReassessedGroundwaterRating,
  ])
    v.forEach((x) => bounded(x, "rating", 0, 100));
  aligned(
    input.callerRmrIncludingOriginalGroundwater,
    input.callerOriginalGroundwaterRating,
    "RMR",
  );
  aligned(
    input.callerRmrIncludingOriginalGroundwater,
    input.callerIndependentlyReassessedGroundwaterRating,
    "RMR",
  );
  const values = input.callerRmrIncludingOriginalGroundwater.map(
    (v, i) =>
      v -
      input.callerOriginalGroundwaterRating[i] +
      input.callerIndependentlyReassessedGroundwaterRating[i],
  );
  values.forEach((v) => bounded(v, "corrected RMR", 0, 100));
  return { groundwaterReconciledRmr: values };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRmrIncludingOriginalGroundwater: [50, 60],
  callerOriginalGroundwaterRating: [10, 10],
  callerIndependentlyReassessedGroundwaterRating: [5, 15],
} satisfies Input;
export const exampleOutput = {
  groundwaterReconciledRmr: [45, 65],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/rmr-groundwater-correction",
  title: "RMR Groundwater Correction Calculator",
  description:
    "Replace independently established groundwater component in same-edition RMR, avoid double subtracting water effect; no rating table or infiltration classification invented. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "groundwaterReconciledRmr",
      label: "Groundwater reconciled rmr",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRmrIncludingOriginalGroundwater:
        value.callerRmrIncludingOriginalGroundwater as readonly number[],
      callerOriginalGroundwaterRating:
        value.callerOriginalGroundwaterRating as readonly number[],
      callerIndependentlyReassessedGroundwaterRating:
        value.callerIndependentlyReassessedGroundwaterRating as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
