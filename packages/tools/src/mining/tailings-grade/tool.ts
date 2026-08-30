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
  readonly feedDryTonnes: number;
  readonly feedAssayFraction: number;
  readonly concentrateDryTonnes: number;
  readonly concentrateAssayFraction: number;
}>;
export type Output = Readonly<{
  readonly tailingsDryTonnes: number;
  readonly tailingsAssayFraction: number;
}>;
const inputFields = [
  { id: "feedDryTonnes", label: "Feed dry tonnes", kind: "number" },
  { id: "feedAssayFraction", label: "Feed assay fraction", kind: "number" },
  {
    id: "concentrateDryTonnes",
    label: "Concentrate dry tonnes",
    kind: "number",
  },
  {
    id: "concentrateAssayFraction",
    label: "Concentrate assay fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.feedDryTonnes, "feedDryTonnes");
  nonnegative(input.concentrateDryTonnes, "concentrateDryTonnes");
  fraction(input.feedAssayFraction, "feedAssayFraction");
  fraction(input.concentrateAssayFraction, "concentrateAssayFraction");
  const tailingsDryTonnes = positive(
      input.feedDryTonnes - input.concentrateDryTonnes,
      "concentrateDryTonnes",
    ),
    tailingsAssayFraction = fraction(
      (input.feedDryTonnes * input.feedAssayFraction -
        input.concentrateDryTonnes * input.concentrateAssayFraction) /
        tailingsDryTonnes,
      "metalBalance",
    );
  return { tailingsDryTonnes, tailingsAssayFraction };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  feedDryTonnes: 100,
  feedAssayFraction: 0.1,
  concentrateDryTonnes: 10,
  concentrateAssayFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  tailingsDryTonnes: 90,
  tailingsAssayFraction: 0.022222222222222223,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/tailings-grade",
  title: "Tailings Grade",
  description:
    "Solve residual tailings mass and assay from a closed dry feed/concentrate balance; impossible negative or above-one assays return errors.",
  inputs: inputFields,
  outputs: [
    { id: "tailingsDryTonnes", label: "Tailings dry tonnes", kind: "number" },
    {
      id: "tailingsAssayFraction",
      label: "Tailings assay fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      feedDryTonnes: value.feedDryTonnes as number,
      feedAssayFraction: value.feedAssayFraction as number,
      concentrateDryTonnes: value.concentrateDryTonnes as number,
      concentrateAssayFraction: value.concentrateAssayFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
