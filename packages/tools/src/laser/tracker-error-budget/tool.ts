import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly independentErrors: readonly number[];
}>;
export type Output = Readonly<{
  readonly rssError: number;
  readonly largestComponent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.independentErrors.length === 0)
    simpleError(
      "independentErrors",
      "At least one error component is required.",
      "empty_errors",
    );
  const absolute = input.independentErrors.map(Math.abs);
  return {
    rssError: Math.sqrt(
      input.independentErrors.reduce((sum, value) => sum + value * value, 0),
    ),
    largestComponent: Math.max(...absolute),
  };
};

export const exampleInput = { independentErrors: [1, 2, 2] } satisfies Input;
export const exampleOutput = {
  rssError: 3,
  largestComponent: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      independentErrors: input.independentErrors as readonly number[],
    }),
  description:
    "Combine independent laser-tracker error components by root-sum-square.",
  id: "laser/tracker-error-budget",
  inputs: [
    {
      id: "independentErrors",
      label: "Independent one-sigma errors",
      kind: "numberList",
      unit: "length",
    },
  ],
  outputs: [
    {
      id: "rssError",
      label: "Root-sum-square error",
      kind: "number",
      minimum: 0,
      unit: "length",
    },
    {
      id: "largestComponent",
      label: "Largest absolute component",
      kind: "number",
      minimum: 0,
      unit: "length",
    },
  ],
  title: "Tracker Error Budget",
});

export const run = tool.execute;
export default tool;
