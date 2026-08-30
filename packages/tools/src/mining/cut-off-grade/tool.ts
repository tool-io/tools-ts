import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly oreCostPerTonne: number;
  readonly metalPricePerTonne: number;
  readonly realizationFraction: number;
  readonly processRecovery: number;
}>;
export type Output = Readonly<{
  readonly cutoffMassFraction: number;
  readonly cutoffPercent: number;
}>;
const inputFields = [
  { id: "oreCostPerTonne", label: "Ore cost per tonne", kind: "number" },
  { id: "metalPricePerTonne", label: "Metal price per tonne", kind: "number" },
  { id: "realizationFraction", label: "Realization fraction", kind: "number" },
  { id: "processRecovery", label: "Process recovery", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.metalPricePerTonne, "metalPricePerTonne");
  positive(input.realizationFraction, "realizationFraction");
  positive(input.processRecovery, "processRecovery");
  nonnegative(input.oreCostPerTonne, "oreCostPerTonne");
  fraction(input.realizationFraction, "realizationFraction");
  fraction(input.processRecovery, "processRecovery");
  const cutoffMassFraction =
    input.oreCostPerTonne /
    (input.metalPricePerTonne *
      input.realizationFraction *
      input.processRecovery);
  return { cutoffMassFraction, cutoffPercent: 100 * cutoffMassFraction };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  oreCostPerTonne: 20,
  metalPricePerTonne: 5000,
  realizationFraction: 0.8,
  processRecovery: 0.5,
} satisfies Input;
export const exampleOutput = {
  cutoffMassFraction: 0.01,
  cutoffPercent: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/cut-off-grade",
  title: "Cut-Off Grade",
  description:
    "Derive a mass-fraction cut-off grade from caller cost, realized metal price and recovery; excludes capacity constraints, taxes and multi-metal credits.",
  inputs: inputFields,
  outputs: [
    { id: "cutoffMassFraction", label: "Cutoff mass fraction", kind: "number" },
    { id: "cutoffPercent", label: "Cutoff percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      oreCostPerTonne: value.oreCostPerTonne as number,
      metalPricePerTonne: value.metalPricePerTonne as number,
      realizationFraction: value.realizationFraction as number,
      processRecovery: value.processRecovery as number,
    }),
});
export const run = tool.execute;
export default tool;
