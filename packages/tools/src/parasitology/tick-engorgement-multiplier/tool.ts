import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly fedTickMassMg: number;
  readonly unfedTickMassMg: number;
}>;
export type Output = Readonly<{
  readonly engorgementMultiplier: number;
  readonly massGainMg: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.fedTickMassMg, "fedTickMassMg");
  positive(input.unfedTickMassMg, "unfedTickMassMg");
  return {
    engorgementMultiplier: input.fedTickMassMg / input.unfedTickMassMg,
    massGainMg: input.fedTickMassMg - input.unfedTickMassMg,
  };
};
export const exampleInput = {
  fedTickMassMg: 10,
  unfedTickMassMg: 2,
} satisfies Input;
export const exampleOutput = {
  engorgementMultiplier: 5,
  massGainMg: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/tick-engorgement-multiplier",
  title: "Tick Engorgement Multiplier",
  description:
    "Compare fed and unfed tick mass as an engorgement ratio and mass gain.",
  inputs: [
    { id: "fedTickMassMg", label: "Fed tick mass mg", kind: "number" },
    { id: "unfedTickMassMg", label: "Unfed tick mass mg", kind: "number" },
  ],
  outputs: [
    {
      id: "engorgementMultiplier",
      label: "Engorgement multiplier",
      kind: "number",
    },
    { id: "massGainMg", label: "Mass gain mg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      fedTickMassMg: value.fedTickMassMg as number,
      unfedTickMassMg: value.unfedTickMassMg as number,
    }),
});
export const run = tool.execute;
export default tool;
