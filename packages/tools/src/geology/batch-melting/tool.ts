import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly initialTrace: number;
  readonly bulkPartition: number;
  readonly meltFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly batchMelt: readonly number[];
  readonly equilibriumSolid: readonly number[];
}>;
const inputFields = [
  { id: "initialTrace", label: "Initial trace", kind: "number" },
  { id: "bulkPartition", label: "Bulk partition", kind: "number" },
  { id: "meltFractions", label: "Melt fractions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.bulkPartition, "bulkPartition");
  nonnegative(input.initialTrace, "initialTrace");
  input.meltFractions.forEach((v) => fraction(v, "meltFractions"));
  const c = input.meltFractions.map(
    (f) =>
      input.initialTrace /
      positive(
        input.bulkPartition + f * (1 - input.bulkPartition),
        "denominator",
      ),
  );
  return {
    batchMelt: c,
    equilibriumSolid: c.map((v) => v * input.bulkPartition),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialTrace: 10,
  bulkPartition: 0.5,
  meltFractions: [0, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  batchMelt: [20, 13.333333333333334, 10],
  equilibriumSolid: [10, 6.666666666666667, 5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/batch-melting",
  title: "Geology Batch Melting Calculator",
  description:
    "Equilibrium batch melt and solid concentrations constant bulkD; F=0 infinitesimal melt limit, F=1 solid hypothetical not actual inventory. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "batchMelt", label: "Batch melt", kind: "numberList" },
    { id: "equilibriumSolid", label: "Equilibrium solid", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      initialTrace: value.initialTrace as number,
      bulkPartition: value.bulkPartition as number,
      meltFractions: value.meltFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
