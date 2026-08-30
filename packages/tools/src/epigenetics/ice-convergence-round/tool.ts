import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly maximumRowDeviations: readonly number[];
  readonly convergenceTolerance: number;
}>;
export type Output = Readonly<{
  readonly convergenceRound: number;
  readonly finalDeviation: number;
  readonly converged: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.maximumRowDeviations.length === 0 ||
    input.maximumRowDeviations.some((v) => v < 0)
  )
    simpleError(
      "maximumRowDeviations",
      "Deviations must be nonempty and nonnegative.",
      "invalid_rounds",
    );
  const index = input.maximumRowDeviations.findIndex(
    (v) => v <= input.convergenceTolerance,
  );
  return {
    convergenceRound: index < 0 ? 0 : index + 1,
    finalDeviation: input.maximumRowDeviations.at(-1)!,
    converged: index >= 0,
  };
};

export const exampleInput = {
  maximumRowDeviations: [0.5, 0.1, 0.01],
  convergenceTolerance: 0.05,
} satisfies Input;
export const exampleOutput = {
  convergenceRound: 3,
  finalDeviation: 0.01,
  converged: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      maximumRowDeviations: input.maximumRowDeviations as readonly number[],
      convergenceTolerance: input.convergenceTolerance as number,
    }),
  description:
    "Find the first ICE correction round meeting a convergence tolerance.",
  id: "epigenetics/ice-convergence-round",
  inputs: [
    {
      id: "maximumRowDeviations",
      label: "Maximum row-sum deviations by round",
      kind: "numberList",
    },
    {
      id: "convergenceTolerance",
      label: "Convergence tolerance",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "convergenceRound",
      label: "One-based convergence round",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "finalDeviation",
      label: "Final supplied deviation",
      kind: "number",
      minimum: 0,
    },
    {
      id: "converged",
      label: "Converged within supplied rounds",
      kind: "boolean",
    },
  ],
  title: "ICE Convergence Round",
});

export const run = tool.execute;
export default tool;
