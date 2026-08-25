import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const rustUredinialCycleDayCounterExample = {
  input: { daysBetweenGenerationsInt: 6 },
  output: { cycleDays: 6, generationsPerThirtyDays: 5 },
} satisfies ToolExample<
  {
    readonly daysBetweenGenerationsInt: number;
  },
  {
    readonly cycleDays: number;
    readonly generationsPerThirtyDays: number;
  }
>;

export const rustUredinialCycleDayCounterTool = createSimpleTool({
  id: "mycology/rust-uredinial-cycle-day-counter",
  title: "Uredinial Cycle Days",
  description:
    "Calculate the number of complete rust uredinial generations possible in a fixed thirty-day period from the days between generations.",
  inputs: [
    {
      id: "daysBetweenGenerationsInt",
      label: "Days between generations",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "cycleDays", label: "Cycle days", kind: "integer" },
    {
      id: "generationsPerThirtyDays",
      label: "Generations per 30 days",
      kind: "integer",
    },
  ],
  calculate: (input) => {
    const cycleDays = input.daysBetweenGenerationsInt as number;
    return {
      cycleDays,
      generationsPerThirtyDays: Math.floor(30 / cycleDays),
    };
  },
});
export const runRustUredinialCycleDayCounter =
  rustUredinialCycleDayCounterTool.execute;
export default rustUredinialCycleDayCounterTool;
