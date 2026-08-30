import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly originalBasis: number;
  readonly originalTokenFairValue: number;
  readonly forkTokenFairValue: number;
}>;
export type Output = Readonly<{
  readonly originalTokenBasis: number;
  readonly forkTokenBasis: number;
  readonly forkBasisPercent: number;
}>;

export const calculate = (input: Input): Output => {
  const totalValue = input.originalTokenFairValue + input.forkTokenFairValue;
  if (totalValue <= 0)
    simpleError(
      "originalTokenFairValue",
      "Combined fair value must be positive.",
      "invalid_value",
    );
  const forkTokenBasis =
    (input.originalBasis * input.forkTokenFairValue) / totalValue;
  return {
    originalTokenBasis: input.originalBasis - forkTokenBasis,
    forkTokenBasis,
    forkBasisPercent:
      input.originalBasis === 0
        ? 0
        : (forkTokenBasis / input.originalBasis) * 100,
  };
};

export const exampleInput = {
  originalBasis: 1000,
  originalTokenFairValue: 750,
  forkTokenFairValue: 250,
} satisfies Input;
export const exampleOutput = {
  originalTokenBasis: 750,
  forkTokenBasis: 250,
  forkBasisPercent: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      originalBasis: input.originalBasis as number,
      originalTokenFairValue: input.originalTokenFairValue as number,
      forkTokenFairValue: input.forkTokenFairValue as number,
    }),
  description:
    "Allocate original basis between hard-fork assets by supplied fair values.",
  id: "taxation/hard-fork-basis-split",
  inputs: [
    {
      id: "originalBasis",
      label: "Original token basis",
      kind: "number",
      minimum: 0,
    },
    {
      id: "originalTokenFairValue",
      label: "Original-token fair value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "forkTokenFairValue",
      label: "Fork-token fair value",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "originalTokenBasis",
      label: "Basis allocated to original token",
      kind: "number",
      minimum: 0,
    },
    {
      id: "forkTokenBasis",
      label: "Basis allocated to fork token",
      kind: "number",
      minimum: 0,
    },
    {
      id: "forkBasisPercent",
      label: "Basis allocated to fork",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Hard-Fork Basis Split",
});

export const run = tool.execute;
export default tool;
