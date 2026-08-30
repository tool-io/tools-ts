import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { fraction, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly yearsLifeLost: number;
  readonly yearsLivedDisability: number;
  readonly parasiteAttributableFraction: number;
}>;
export type Output = Readonly<{
  readonly totalDalys: number;
  readonly attributableDalys: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.yearsLifeLost, "yearsLifeLost");
  nonnegative(input.yearsLivedDisability, "yearsLivedDisability");
  fraction(input.parasiteAttributableFraction, "parasiteAttributableFraction");
  const totalDalys = input.yearsLifeLost + input.yearsLivedDisability;
  return {
    totalDalys,
    attributableDalys: totalDalys * input.parasiteAttributableFraction,
  };
};
export const exampleInput = {
  yearsLifeLost: 100,
  yearsLivedDisability: 50,
  parasiteAttributableFraction: 0.4,
} satisfies Input;
export const exampleOutput = {
  totalDalys: 150,
  attributableDalys: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/attributable-daly-burden",
  title: "Attributable DALY Burden",
  description:
    "Apply a supplied attributable fraction to precomputed years lost and years lived with disability.",
  inputs: [
    { id: "yearsLifeLost", label: "Years life lost", kind: "number" },
    {
      id: "yearsLivedDisability",
      label: "Years lived disability",
      kind: "number",
    },
    {
      id: "parasiteAttributableFraction",
      label: "Parasite attributable fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "totalDalys", label: "Total dalys", kind: "number" },
    { id: "attributableDalys", label: "Attributable dalys", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      yearsLifeLost: value.yearsLifeLost as number,
      yearsLivedDisability: value.yearsLivedDisability as number,
      parasiteAttributableFraction:
        value.parasiteAttributableFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
