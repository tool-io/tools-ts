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
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRoFeedLitersByBatch: readonly number[];
  readonly observedRoPermeateLitersByBatch: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedRoRecoveryFractions: readonly number[];
  readonly pooledRoRecoveryFraction: number;
  readonly observedConcentrateLitersByBatch: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRoFeedLitersByBatch",
    label: "Observed ro feed liters by batch",
    kind: "numberList",
  },
  {
    id: "observedRoPermeateLitersByBatch",
    label: "Observed ro permeate liters by batch",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRoFeedLitersByBatch.forEach((v) =>
    positive(v, "observedRoFeedLitersByBatch"),
  );
  input.observedRoPermeateLitersByBatch.forEach((v) =>
    nonnegative(v, "observedRoPermeateLitersByBatch"),
  );
  aligned(
    input.observedRoFeedLitersByBatch,
    input.observedRoPermeateLitersByBatch,
    "observedRoFeedLitersByBatch",
  );
  if (
    input.observedRoPermeateLitersByBatch.some(
      (v, i) => v > input.observedRoFeedLitersByBatch[i],
    )
  )
    simpleError("waterBalance", "Permeate exceeds observed feed.");
  return {
    observedRoRecoveryFractions: input.observedRoPermeateLitersByBatch.map(
      (v, i) => v / input.observedRoFeedLitersByBatch[i],
    ),
    pooledRoRecoveryFraction:
      sum(input.observedRoPermeateLitersByBatch) /
      sum(input.observedRoFeedLitersByBatch),
    observedConcentrateLitersByBatch: input.observedRoFeedLitersByBatch.map(
      (v, i) => v - input.observedRoPermeateLitersByBatch[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRoFeedLitersByBatch: [100, 200],
  observedRoPermeateLitersByBatch: [30, 80],
} satisfies Input;
export const exampleOutput = {
  observedRoRecoveryFractions: [0.3, 0.4],
  pooledRoRecoveryFraction: 0.36666666666666664,
  observedConcentrateLitersByBatch: [70, 120],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/reverse-osmosis-recovery-rate",
  title: "Plumbing Reverse Osmosis Recovery Rate Calculator",
  description:
    "Reconcile actual reverse-osmosis feed/permeate batches and pooled volume recovery, concentration inventory by closure only; no rejection/quality or operating pressure inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRoRecoveryFractions",
      label: "Observed ro recovery fractions",
      kind: "numberList",
    },
    {
      id: "pooledRoRecoveryFraction",
      label: "Pooled ro recovery fraction",
      kind: "number",
    },
    {
      id: "observedConcentrateLitersByBatch",
      label: "Observed concentrate liters by batch",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRoFeedLitersByBatch:
        value.observedRoFeedLitersByBatch as readonly number[],
      observedRoPermeateLitersByBatch:
        value.observedRoPermeateLitersByBatch as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
