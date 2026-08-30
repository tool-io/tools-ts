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
  readonly feedSlurryTonnes: number;
  readonly feedSolidMassFraction: number;
  readonly productSlurryTonnes: number;
  readonly productSolidMassFraction: number;
}>;
export type Output = Readonly<{
  readonly feedWaterTonnes: number;
  readonly productWaterTonnes: number;
  readonly waterRecoveryFraction: number;
}>;
const inputFields = [
  { id: "feedSlurryTonnes", label: "Feed slurry tonnes", kind: "number" },
  {
    id: "feedSolidMassFraction",
    label: "Feed solid mass fraction",
    kind: "number",
  },
  { id: "productSlurryTonnes", label: "Product slurry tonnes", kind: "number" },
  {
    id: "productSolidMassFraction",
    label: "Product solid mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.feedSlurryTonnes, "feedSlurryTonnes");
  nonnegative(input.productSlurryTonnes, "productSlurryTonnes");
  fraction(input.feedSolidMassFraction, "feedSolidMassFraction");
  fraction(input.productSolidMassFraction, "productSolidMassFraction");
  const feedWaterTonnes = positive(
      input.feedSlurryTonnes * (1 - input.feedSolidMassFraction),
      "feedSolidMassFraction",
    ),
    productWaterTonnes =
      input.productSlurryTonnes * (1 - input.productSolidMassFraction);
  return {
    feedWaterTonnes,
    productWaterTonnes,
    waterRecoveryFraction: fraction(
      productWaterTonnes / feedWaterTonnes,
      "productSlurryTonnes",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  feedSlurryTonnes: 100,
  feedSolidMassFraction: 0.4,
  productSlurryTonnes: 40,
  productSolidMassFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  feedWaterTonnes: 60,
  productWaterTonnes: 20,
  waterRecoveryFraction: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/water-recovery",
  title: "Water Recovery",
  description:
    "Derive water recovery from measured feed/product slurry masses and solid fractions; assumes no intervening water additions and matched streams.",
  inputs: inputFields,
  outputs: [
    { id: "feedWaterTonnes", label: "Feed water tonnes", kind: "number" },
    { id: "productWaterTonnes", label: "Product water tonnes", kind: "number" },
    {
      id: "waterRecoveryFraction",
      label: "Water recovery fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      feedSlurryTonnes: value.feedSlurryTonnes as number,
      feedSolidMassFraction: value.feedSolidMassFraction as number,
      productSlurryTonnes: value.productSlurryTonnes as number,
      productSolidMassFraction: value.productSolidMassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
