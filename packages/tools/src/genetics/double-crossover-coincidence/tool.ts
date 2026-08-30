import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, fraction, positive } from "../shared.js";

export type Input = Readonly<{
  readonly observedDoubleCrossovers: number;
  readonly totalProgeny: number;
  readonly firstIntervalRecombination: number;
  readonly secondIntervalRecombination: number;
}>;
export type Output = Readonly<{
  readonly expectedDoubleCrossovers: number;
  readonly coefficientOfCoincidence: number;
  readonly interference: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.observedDoubleCrossovers, "observedDoubleCrossovers");
  count(input.totalProgeny, "totalProgeny", 1);
  fraction(input.firstIntervalRecombination, "firstIntervalRecombination");
  fraction(input.secondIntervalRecombination, "secondIntervalRecombination");
  if (input.observedDoubleCrossovers > input.totalProgeny)
    simpleError(
      "observedDoubleCrossovers",
      "Observed crossovers cannot exceed progeny.",
    );
  const expectedDoubleCrossovers =
    input.totalProgeny *
    input.firstIntervalRecombination *
    input.secondIntervalRecombination;
  positive(expectedDoubleCrossovers, "firstIntervalRecombination");
  const coefficientOfCoincidence =
    input.observedDoubleCrossovers / expectedDoubleCrossovers;
  return {
    expectedDoubleCrossovers,
    coefficientOfCoincidence,
    interference: 1 - coefficientOfCoincidence,
  };
};
export const exampleInput = {
  observedDoubleCrossovers: 10,
  totalProgeny: 1000,
  firstIntervalRecombination: 0.1,
  secondIntervalRecombination: 0.2,
} satisfies Input;
export const exampleOutput = {
  expectedDoubleCrossovers: 20,
  coefficientOfCoincidence: 0.5,
  interference: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/double-crossover-coincidence",
  title: "Double Crossover Coincidence",
  description:
    "Compare observed double crossovers with independent-interval expectation and compute interference.",
  inputs: [
    {
      id: "observedDoubleCrossovers",
      label: "Observed double crossovers",
      kind: "integer",
    },
    { id: "totalProgeny", label: "Total progeny", kind: "integer" },
    {
      id: "firstIntervalRecombination",
      label: "First interval recombination",
      kind: "number",
    },
    {
      id: "secondIntervalRecombination",
      label: "Second interval recombination",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "expectedDoubleCrossovers",
      label: "Expected double crossovers",
      kind: "number",
    },
    {
      id: "coefficientOfCoincidence",
      label: "Coefficient of coincidence",
      kind: "number",
    },
    { id: "interference", label: "Interference", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedDoubleCrossovers: value.observedDoubleCrossovers as number,
      totalProgeny: value.totalProgeny as number,
      firstIntervalRecombination: value.firstIntervalRecombination as number,
      secondIntervalRecombination: value.secondIntervalRecombination as number,
    }),
});
export const run = tool.execute;
export default tool;
