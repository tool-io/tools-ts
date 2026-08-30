import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly intervalHours: readonly number[];
  readonly intervalTemperaturesC: readonly number[];
  readonly minimumAllowedC: number;
  readonly maximumAllowedC: number;
}>;
export type Output = Readonly<{
  readonly hotExcursionHours: number;
  readonly coldExcursionHours: number;
  readonly totalExcursionHours: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.intervalHours, input.intervalTemperaturesC, "intervalHours");
  input.intervalHours.forEach((v) => nonnegative(v, "intervalHours"));
  if (input.minimumAllowedC > input.maximumAllowedC)
    simpleError("minimumAllowedC", "Ordered temperature bounds required.");
  const hotExcursionHours = input.intervalHours.reduce(
      (sum, v, i) =>
        sum + (input.intervalTemperaturesC[i] > input.maximumAllowedC ? v : 0),
      0,
    ),
    coldExcursionHours = input.intervalHours.reduce(
      (sum, v, i) =>
        sum + (input.intervalTemperaturesC[i] < input.minimumAllowedC ? v : 0),
      0,
    );
  return {
    hotExcursionHours,
    coldExcursionHours,
    totalExcursionHours: hotExcursionHours + coldExcursionHours,
  };
};
export const exampleInput = {
  intervalHours: [1, 2, 3],
  intervalTemperaturesC: [4, 10, -2],
  minimumAllowedC: 2,
  maximumAllowedC: 8,
} satisfies Input;
export const exampleOutput = {
  hotExcursionHours: 2,
  coldExcursionHours: 3,
  totalExcursionHours: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/cold-chain-excursion-integral",
  title: "Cold Chain Excursion Integral",
  description:
    "Integrate piecewise-constant cold-chain temperatures outside supplied bounds; excursion time alone does not determine product usability.",
  inputs: [
    { id: "intervalHours", label: "Interval hours", kind: "numberList" },
    {
      id: "intervalTemperaturesC",
      label: "Interval temperatures c",
      kind: "numberList",
    },
    { id: "minimumAllowedC", label: "Minimum allowed c", kind: "number" },
    { id: "maximumAllowedC", label: "Maximum allowed c", kind: "number" },
  ],
  outputs: [
    { id: "hotExcursionHours", label: "Hot excursion hours", kind: "number" },
    { id: "coldExcursionHours", label: "Cold excursion hours", kind: "number" },
    {
      id: "totalExcursionHours",
      label: "Total excursion hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      intervalHours: value.intervalHours as readonly number[],
      intervalTemperaturesC: value.intervalTemperaturesC as readonly number[],
      minimumAllowedC: value.minimumAllowedC as number,
      maximumAllowedC: value.maximumAllowedC as number,
    }),
});
export const run = tool.execute;
export default tool;
