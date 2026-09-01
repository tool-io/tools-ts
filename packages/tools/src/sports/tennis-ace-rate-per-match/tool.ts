import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sum,
  mean,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedAceCountsByMatch: readonly number[];
  readonly observedServicePointsByMatch: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedAcesPerMatch: number;
  readonly pooledAcesPer100ServicePoints: number;
}>;
const inputFields = [
  {
    id: "observedAceCountsByMatch",
    label: "Observed ace counts by match",
    kind: "numberList",
  },
  {
    id: "observedServicePointsByMatch",
    label: "Observed service points by match",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedAceCountsByMatch,
    input.observedServicePointsByMatch,
    "matches",
  );
  input.observedServicePointsByMatch.forEach((v) =>
    bounded(v, "points", 1, 1000000),
  );
  input.observedAceCountsByMatch.forEach((v, i) =>
    bounded(v, "aces", 0, input.observedServicePointsByMatch[i]),
  );
  return {
    observedAcesPerMatch: mean(input.observedAceCountsByMatch),
    pooledAcesPer100ServicePoints:
      (100 * sum(input.observedAceCountsByMatch)) /
      sum(input.observedServicePointsByMatch),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAceCountsByMatch: [5, 10],
  observedServicePointsByMatch: [50, 100],
} satisfies Input;
export const exampleOutput = {
  observedAcesPerMatch: 7.5,
  pooledAcesPer100ServicePoints: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/tennis-ace-rate-per-match",
  title: "Ace Rate Per Match Calculator",
  description:
    "Separate actual tennis per-match ace average from point-exposure pooled ace rate, unequal match lengths explicit.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAcesPerMatch",
      label: "Observed aces per match",
      kind: "number",
    },
    {
      id: "pooledAcesPer100ServicePoints",
      label: "Pooled aces per100 service points",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAceCountsByMatch:
        value.observedAceCountsByMatch as readonly number[],
      observedServicePointsByMatch:
        value.observedServicePointsByMatch as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
