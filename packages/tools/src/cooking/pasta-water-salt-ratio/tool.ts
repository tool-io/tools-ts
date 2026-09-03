import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSaltG: number;
  readonly observedPastaWaterG: number;
}>;
export type Output = Readonly<{
  readonly saltPerWaterPercent: number;
  readonly initialDissolvedSaltMassPercent: number;
}>;
const inputFields = [
  { id: "observedSaltG", label: "Observed salt g", kind: "number" },
  {
    id: "observedPastaWaterG",
    label: "Observed pasta water g",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedPastaWaterG, "observedPastaWaterG");
  nonnegative(input.observedSaltG, "observedSaltG");
  const t = positive(input.observedSaltG + input.observedPastaWaterG, "total");
  return {
    saltPerWaterPercent:
      (100 * input.observedSaltG) / input.observedPastaWaterG,
    initialDissolvedSaltMassPercent: (100 * input.observedSaltG) / t,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSaltG: 10,
  observedPastaWaterG: 1000,
} satisfies Input;
export const exampleOutput = {
  saltPerWaterPercent: 1,
  initialDissolvedSaltMassPercent: 0.9900990099009901,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/pasta-water-salt-ratio",
  title: "Cooking Pasta Water Salt Ratio Calculator",
  description:
    "Distinguish pasta-water salt/water recipe percent from initial dissolved-salt/solution mass percent; evaporation/starch transfer not assumed. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "saltPerWaterPercent",
      label: "Salt per water percent",
      kind: "number",
    },
    {
      id: "initialDissolvedSaltMassPercent",
      label: "Initial dissolved salt mass percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSaltG: value.observedSaltG as number,
      observedPastaWaterG: value.observedPastaWaterG as number,
    }),
});
export const run = tool.execute;
export default tool;
