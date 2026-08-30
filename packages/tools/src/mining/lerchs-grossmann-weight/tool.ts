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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly blockTonnes: readonly number[];
  readonly blockGradeFractions: readonly number[];
  readonly processingFlags: readonly number[];
  readonly metalPricePerTonne: number;
  readonly recoveryFraction: number;
  readonly payableFraction: number;
  readonly miningCostPerTonne: number;
  readonly processingCostPerTonne: number;
}>;
export type Output = Readonly<{
  readonly blockEconomicWeights: readonly number[];
  readonly sumEconomicWeight: number;
}>;
const inputFields = [
  { id: "blockTonnes", label: "Block tonnes", kind: "numberList" },
  {
    id: "blockGradeFractions",
    label: "Block grade fractions",
    kind: "numberList",
  },
  { id: "processingFlags", label: "Processing flags", kind: "numberList" },
  { id: "metalPricePerTonne", label: "Metal price per tonne", kind: "number" },
  { id: "recoveryFraction", label: "Recovery fraction", kind: "number" },
  { id: "payableFraction", label: "Payable fraction", kind: "number" },
  { id: "miningCostPerTonne", label: "Mining cost per tonne", kind: "number" },
  {
    id: "processingCostPerTonne",
    label: "Processing cost per tonne",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.metalPricePerTonne, "metalPricePerTonne");
  input.blockTonnes.forEach((v) => nonnegative(v, "blockTonnes"));
  nonnegative(input.miningCostPerTonne, "miningCostPerTonne");
  nonnegative(input.processingCostPerTonne, "processingCostPerTonne");
  input.blockGradeFractions.forEach((v) => fraction(v, "blockGradeFractions"));
  fraction(input.recoveryFraction, "recoveryFraction");
  fraction(input.payableFraction, "payableFraction");
  aligned(input.blockTonnes, input.blockGradeFractions, "blockTonnes");
  aligned(input.blockTonnes, input.processingFlags, "blockTonnes");
  if (input.processingFlags.some((v) => v !== 0 && v !== 1))
    simpleError("processingFlags", "Binary processing flags required.");
  const blockEconomicWeights = input.blockTonnes.map(
    (v, i) =>
      v *
      (input.processingFlags[i] *
        (input.blockGradeFractions[i] *
          input.metalPricePerTonne *
          input.recoveryFraction *
          input.payableFraction -
          input.processingCostPerTonne) -
        input.miningCostPerTonne),
  );
  return {
    blockEconomicWeights,
    sumEconomicWeight: blockEconomicWeights.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  blockTonnes: [100, 50],
  blockGradeFractions: [0.01, 0],
  processingFlags: [1, 0],
  metalPricePerTonne: 5000,
  recoveryFraction: 0.8,
  payableFraction: 0.9,
  miningCostPerTonne: 5,
  processingCostPerTonne: 10,
} satisfies Input;
export const exampleOutput = {
  blockEconomicWeights: [2100, -250],
  sumEconomicWeight: 1850,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/lerchs-grossmann-weight",
  title: "Lerchs-Grossmann Weight",
  description:
    "Calculate economic node weights for process/waste blocks; prepares weights but does not execute Lerchs–Grossmann closure or precedence slopes.",
  inputs: inputFields,
  outputs: [
    {
      id: "blockEconomicWeights",
      label: "Block economic weights",
      kind: "numberList",
    },
    { id: "sumEconomicWeight", label: "Sum economic weight", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      blockTonnes: value.blockTonnes as readonly number[],
      blockGradeFractions: value.blockGradeFractions as readonly number[],
      processingFlags: value.processingFlags as readonly number[],
      metalPricePerTonne: value.metalPricePerTonne as number,
      recoveryFraction: value.recoveryFraction as number,
      payableFraction: value.payableFraction as number,
      miningCostPerTonne: value.miningCostPerTonne as number,
      processingCostPerTonne: value.processingCostPerTonne as number,
    }),
});
export const run = tool.execute;
export default tool;
