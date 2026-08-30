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
  readonly feedDryTonnes: number;
  readonly feedAssayFraction: number;
  readonly productDryTonnes: readonly number[];
  readonly productAssayFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly productMetalRecoveriesPercent: readonly number[];
  readonly totalMetalRecoveryPercent: number;
  readonly unrecoveredMetalTonnes: number;
}>;
const inputFields = [
  { id: "feedDryTonnes", label: "Feed dry tonnes", kind: "number" },
  { id: "feedAssayFraction", label: "Feed assay fraction", kind: "number" },
  { id: "productDryTonnes", label: "Product dry tonnes", kind: "numberList" },
  {
    id: "productAssayFractions",
    label: "Product assay fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.feedDryTonnes, "feedDryTonnes");
  positive(input.feedAssayFraction, "feedAssayFraction");
  input.productDryTonnes.forEach((v) => nonnegative(v, "productDryTonnes"));
  fraction(input.feedAssayFraction, "feedAssayFraction");
  input.productAssayFractions.forEach((v) =>
    fraction(v, "productAssayFractions"),
  );
  aligned(
    input.productDryTonnes,
    input.productAssayFractions,
    "productDryTonnes",
  );
  if (input.productDryTonnes.reduce((a, b) => a + b, 0) > input.feedDryTonnes)
    simpleError("productDryTonnes", "Product mass exceeds feed.");
  const feed = input.feedDryTonnes * input.feedAssayFraction,
    metals = input.productDryTonnes.map(
      (v, i) => v * input.productAssayFractions[i],
    ),
    total = metals.reduce((a, b) => a + b, 0);
  fraction(total / feed, "productAssayFractions");
  return {
    productMetalRecoveriesPercent: metals.map((v) => (100 * v) / feed),
    totalMetalRecoveryPercent: (100 * total) / feed,
    unrecoveredMetalTonnes: feed - total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  feedDryTonnes: 100,
  feedAssayFraction: 0.1,
  productDryTonnes: [10, 5],
  productAssayFractions: [0.6, 0.4],
} satisfies Input;
export const exampleOutput = {
  productMetalRecoveriesPercent: [60, 20],
  totalMetalRecoveryPercent: 80,
  unrecoveredMetalTonnes: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/recovery-percentage",
  title: "Recovery Percentage",
  description:
    "Balance metal recovery across multiple disjoint dry product streams; unlike analytical spike recovery, this checks both process mass and contained-metal feasibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "productMetalRecoveriesPercent",
      label: "Product metal recoveries percent",
      kind: "numberList",
    },
    {
      id: "totalMetalRecoveryPercent",
      label: "Total metal recovery percent",
      kind: "number",
    },
    {
      id: "unrecoveredMetalTonnes",
      label: "Unrecovered metal tonnes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      feedDryTonnes: value.feedDryTonnes as number,
      feedAssayFraction: value.feedAssayFraction as number,
      productDryTonnes: value.productDryTonnes as readonly number[],
      productAssayFractions: value.productAssayFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
