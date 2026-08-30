import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly microfilaremiaPositive: number;
  readonly totalExamined: number;
  readonly maximumPrevalenceFraction: number;
}>;
export type Output = Readonly<{
  readonly observedPrevalencePercent: number;
  readonly belowThreshold: boolean;
}>;
export const calculate = (input: Input): Output => {
  count(input.microfilaremiaPositive, "microfilaremiaPositive");
  count(input.totalExamined, "totalExamined", 1);
  fraction(input.maximumPrevalenceFraction, "maximumPrevalenceFraction");
  if (input.microfilaremiaPositive > input.totalExamined)
    simpleError(
      "microfilaremiaPositive",
      "Positive count cannot exceed examined subjects.",
    );
  const observed = input.microfilaremiaPositive / input.totalExamined;
  return {
    observedPrevalencePercent: 100 * observed,
    belowThreshold: observed < input.maximumPrevalenceFraction,
  };
};
export const exampleInput = {
  microfilaremiaPositive: 3,
  totalExamined: 1000,
  maximumPrevalenceFraction: 0.01,
} satisfies Input;
export const exampleOutput = {
  observedPrevalencePercent: 0.3,
  belowThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/microfilaremia-prevalence-screen",
  title: "Microfilaremia Prevalence Screen",
  description:
    "Screen observed microfilaremia prevalence against a supplied limit; does not certify elimination.",
  inputs: [
    {
      id: "microfilaremiaPositive",
      label: "Microfilaremia positive",
      kind: "integer",
    },
    { id: "totalExamined", label: "Total examined", kind: "integer" },
    {
      id: "maximumPrevalenceFraction",
      label: "Maximum prevalence fraction",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "observedPrevalencePercent",
      label: "Observed prevalence percent",
      kind: "number",
    },
    { id: "belowThreshold", label: "Below threshold", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      microfilaremiaPositive: value.microfilaremiaPositive as number,
      totalExamined: value.totalExamined as number,
      maximumPrevalenceFraction: value.maximumPrevalenceFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
