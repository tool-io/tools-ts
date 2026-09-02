import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedFilledGrainsByPanicle: readonly number[];
  readonly observedUnfilledGrainsByPanicle: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanTotalGrainsPerPanicle: number;
  readonly pooledFilledGrainFraction: number;
}>;
const inputFields = [
  {
    id: "observedFilledGrainsByPanicle",
    label: "Observed filled grains by panicle",
    kind: "numberList",
  },
  {
    id: "observedUnfilledGrainsByPanicle",
    label: "Observed unfilled grains by panicle",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedFilledGrainsByPanicle.forEach((v) =>
    nonnegative(v, "observedFilledGrainsByPanicle"),
  );
  input.observedUnfilledGrainsByPanicle.forEach((v) =>
    nonnegative(v, "observedUnfilledGrainsByPanicle"),
  );
  aligned(
    input.observedFilledGrainsByPanicle,
    input.observedUnfilledGrainsByPanicle,
    "observedFilledGrainsByPanicle",
  );
  input.observedFilledGrainsByPanicle.forEach((v) => integer(v, "filled"));
  input.observedUnfilledGrainsByPanicle.forEach((v) => integer(v, "unfilled"));
  const filled = sum(input.observedFilledGrainsByPanicle),
    total = filled + sum(input.observedUnfilledGrainsByPanicle);
  positive(total, "grain evidence");
  return {
    meanTotalGrainsPerPanicle:
      total / input.observedFilledGrainsByPanicle.length,
    pooledFilledGrainFraction: filled / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFilledGrainsByPanicle: [10, 20],
  observedUnfilledGrainsByPanicle: [2, 3],
} satisfies Input;
export const exampleOutput = {
  meanTotalGrainsPerPanicle: 17.5,
  pooledFilledGrainFraction: 0.8571428571428571,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/grains-per-panicle",
  title: "Agriculture Grains Per Panicle Calculator",
  description:
    "Actual sampled panicle filled/unfilled inventories, not grain-number multiplication from projected yield. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "meanTotalGrainsPerPanicle",
      label: "Mean total grains per panicle",
      kind: "number",
    },
    {
      id: "pooledFilledGrainFraction",
      label: "Pooled filled grain fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFilledGrainsByPanicle:
        value.observedFilledGrainsByPanicle as readonly number[],
      observedUnfilledGrainsByPanicle:
        value.observedUnfilledGrainsByPanicle as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
