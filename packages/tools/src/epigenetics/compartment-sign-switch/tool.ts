import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly compartmentEigenvector: readonly number[];
}>;
export type Output = Readonly<{
  readonly switchIndexes: readonly number[];
  readonly switchCount: number;
  readonly positiveSegmentCount: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.compartmentEigenvector.length === 0)
    simpleError(
      "compartmentEigenvector",
      "At least one eigenvector value is required.",
      "empty_values",
    );
  const sign = (v: number) => (v > 0 ? 1 : v < 0 ? -1 : 0),
    switchIndexes: number[] = [];
  let previous = sign(input.compartmentEigenvector[0]),
    positiveSegmentCount = previous > 0 ? 1 : 0;
  for (let i = 1; i < input.compartmentEigenvector.length; i += 1) {
    const current = sign(input.compartmentEigenvector[i]);
    if (current !== 0 && previous !== 0 && current !== previous) {
      switchIndexes.push(i);
      if (current > 0) positiveSegmentCount += 1;
    }
    if (current !== 0) previous = current;
  }
  return {
    switchIndexes,
    switchCount: switchIndexes.length,
    positiveSegmentCount,
  };
};

export const exampleInput = {
  compartmentEigenvector: [1, 2, -1, -2, 3],
} satisfies Input;
export const exampleOutput = {
  switchIndexes: [2, 4],
  switchCount: 2,
  positiveSegmentCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      compartmentEigenvector: input.compartmentEigenvector as readonly number[],
    }),
  description: "Detect A/B compartment eigenvector sign-switch boundaries.",
  id: "epigenetics/compartment-sign-switch",
  inputs: [
    {
      id: "compartmentEigenvector",
      label: "Compartment eigenvector values",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "switchIndexes",
      label: "Indexes where sign switches",
      kind: "numberList",
    },
    {
      id: "switchCount",
      label: "Sign-switch count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "positiveSegmentCount",
      label: "Positive compartment segments",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Compartment Sign Switch",
});

export const run = tool.execute;
export default tool;
