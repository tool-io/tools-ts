import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rectilinearVisibility: number;
  readonly diagonalVisibility: number;
  readonly violationThreshold: number;
}>;
export type Output = Readonly<{
  readonly meanVisibility: number;
  readonly estimatedChshS: number;
  readonly exceedsThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  const meanVisibility =
    (input.rectilinearVisibility + input.diagonalVisibility) / 2;
  const estimatedChshS = 2 * Math.SQRT2 * meanVisibility;
  return {
    meanVisibility,
    estimatedChshS,
    exceedsThreshold: estimatedChshS > input.violationThreshold,
  };
};

export const exampleInput = {
  rectilinearVisibility: 0.9,
  diagonalVisibility: 0.8,
  violationThreshold: 2,
} satisfies Input;
export const exampleOutput = {
  meanVisibility: 0.8500000000000001,
  estimatedChshS: 2.404163056034262,
  exceedsThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      rectilinearVisibility: input.rectilinearVisibility as number,
      diagonalVisibility: input.diagonalVisibility as number,
      violationThreshold: input.violationThreshold as number,
    }),
  description:
    "Estimate a two-basis BBO entanglement CHSH value from measured visibilities.",
  id: "laser/bbo-entanglement-setup-check",
  inputs: [
    {
      id: "rectilinearVisibility",
      label: "Rectilinear-basis visibility",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "diagonalVisibility",
      label: "Diagonal-basis visibility",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "violationThreshold",
      label: "CHSH violation threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "meanVisibility",
      label: "Mean visibility",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "estimatedChshS",
      label: "Estimated CHSH S",
      kind: "number",
      minimum: 0,
    },
    { id: "exceedsThreshold", label: "Exceeds threshold", kind: "boolean" },
  ],
  title: "BBO Entanglement Setup Check",
});

export const run = tool.execute;
export default tool;
