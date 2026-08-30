import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly susceptibleFraction: number;
  readonly reproductionNumber: number;
}>;
export type Output = Readonly<{
  readonly criticalSusceptibleFraction: number;
  readonly effectiveReproductionNumber: number;
  readonly infectiousTrend: string;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.susceptibleFraction, "susceptibleFraction");
  positive(input.reproductionNumber, "reproductionNumber");
  const criticalSusceptibleFraction = 1 / input.reproductionNumber,
    effectiveReproductionNumber =
      input.susceptibleFraction * input.reproductionNumber;
  return {
    criticalSusceptibleFraction,
    effectiveReproductionNumber,
    infectiousTrend:
      effectiveReproductionNumber > 1
        ? "growing"
        : effectiveReproductionNumber < 1
          ? "declining"
          : "peak-boundary",
  };
};
export const exampleInput = {
  susceptibleFraction: 0.4,
  reproductionNumber: 2,
} satisfies Input;
export const exampleOutput = {
  criticalSusceptibleFraction: 0.5,
  effectiveReproductionNumber: 0.8,
  infectiousTrend: "declining",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/sir-infectious-peak-screen",
  title: "SIR Infectious Peak Screen",
  description:
    "Screen the instantaneous infectious trend under a closed homogeneous SIR model; this is not calendar peak timing.",
  inputs: [
    {
      id: "susceptibleFraction",
      label: "Susceptible fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    { id: "reproductionNumber", label: "Reproduction number", kind: "number" },
  ],
  outputs: [
    {
      id: "criticalSusceptibleFraction",
      label: "Critical susceptible fraction",
      kind: "number",
    },
    {
      id: "effectiveReproductionNumber",
      label: "Effective reproduction number",
      kind: "number",
    },
    { id: "infectiousTrend", label: "Infectious trend", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      susceptibleFraction: value.susceptibleFraction as number,
      reproductionNumber: value.reproductionNumber as number,
    }),
});
export const run = tool.execute;
export default tool;
