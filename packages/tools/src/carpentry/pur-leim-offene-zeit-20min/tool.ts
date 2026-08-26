import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PurOpenTimeInput = {
  readonly elapsedMinutes: number;
  readonly openTimeBaseMinutes?: number;
};

export type PurOpenTimeOutput = {
  readonly remainingOpenMinutes: number;
};

export const purOpenTimeExample = {
  input: { elapsedMinutes: 5 },
  output: { remainingOpenMinutes: 15 },
} satisfies ToolExample<PurOpenTimeInput, PurOpenTimeOutput>;

export const purOpenTimeTool = createSimpleTool({
  id: "carpentry/pur-leim-offene-zeit-20min",
  title: "PUR Open Time Remaining",
  description:
    "Compute the remaining open time in minutes for PUR adhesive from elapsed minutes and an open time base.",
  inputs: [
    {
      description: "Minutes elapsed since applying the adhesive.",
      id: "elapsedMinutes",
      kind: "number",
      label: "Elapsed time",
      minimum: 0,
      unit: "min",
    },
    {
      default: 20,
      description:
        "Total open time base in minutes; strictly between zero and one hundred twenty; twenty is typical for PUR.",
      id: "openTimeBaseMinutes",
      kind: "number",
      label: "Open time base",
      maximum: 120,
      minimum: 0,
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Remaining open time in minutes, never below zero.",
      format: "duration",
      id: "remainingOpenMinutes",
      kind: "number",
      label: "Remaining open time",
      unit: "min",
    },
  ],
  calculate: (input) => {
    const openTimeBaseMinutes = input.openTimeBaseMinutes as number;
    if (!(openTimeBaseMinutes > 0 && openTimeBaseMinutes < 120))
      simpleError(
        "openTimeBaseMinutes",
        "The open time base must be strictly between zero and one hundred twenty minutes.",
        "invalid_base",
      );
    return {
      remainingOpenMinutes: Math.max(
        0,
        openTimeBaseMinutes - (input.elapsedMinutes as number),
      ),
    };
  },
});
export const runPurOpenTime = purOpenTimeTool.execute;
export default purOpenTimeTool;
