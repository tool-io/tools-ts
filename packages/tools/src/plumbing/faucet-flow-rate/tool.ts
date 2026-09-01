import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedFaucetCollectionLiters: readonly number[];
  readonly observedCollectionSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedFaucetLitersMinute: readonly number[];
  readonly pooledFaucetLitersMinute: number;
}>;
const inputFields = [
  {
    id: "observedFaucetCollectionLiters",
    label: "Observed faucet collection liters",
    kind: "numberList",
  },
  {
    id: "observedCollectionSeconds",
    label: "Observed collection seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCollectionSeconds.forEach((v) =>
    positive(v, "observedCollectionSeconds"),
  );
  input.observedFaucetCollectionLiters.forEach((v) =>
    nonnegative(v, "observedFaucetCollectionLiters"),
  );
  aligned(
    input.observedFaucetCollectionLiters,
    input.observedCollectionSeconds,
    "observedFaucetCollectionLiters",
  );
  return {
    observedFaucetLitersMinute: input.observedFaucetCollectionLiters.map(
      (v, i) => (v * 60) / input.observedCollectionSeconds[i],
    ),
    pooledFaucetLitersMinute:
      (sum(input.observedFaucetCollectionLiters) * 60) /
      sum(input.observedCollectionSeconds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFaucetCollectionLiters: [1, 2],
  observedCollectionSeconds: [10, 30],
} satisfies Input;
export const exampleOutput = {
  observedFaucetLitersMinute: [6, 4],
  pooledFaucetLitersMinute: 4.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/faucet-flow-rate",
  title: "Plumbing Faucet Flow Rate Calculator",
  description:
    "Calibrate actual timed faucet collection flow, unequal exposures pooled by collected volume/time; not nominal aerator capacity or whole-house demand.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFaucetLitersMinute",
      label: "Observed faucet liters minute",
      kind: "numberList",
    },
    {
      id: "pooledFaucetLitersMinute",
      label: "Pooled faucet liters minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFaucetCollectionLiters:
        value.observedFaucetCollectionLiters as readonly number[],
      observedCollectionSeconds:
        value.observedCollectionSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
