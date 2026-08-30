import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, positive } from "../shared.js";

export type Input = Readonly<{
  readonly cercariaCounts: readonly number[];
  readonly observedSnails: number;
  readonly observationHours: number;
}>;
export type Output = Readonly<{
  readonly totalCercariae: number;
  readonly cercariaePerSnailHour: number;
}>;
export const calculate = (input: Input): Output => {
  if (!input.cercariaCounts.length)
    simpleError("cercariaCounts", "Observed output counts required.");
  input.cercariaCounts.forEach((v) => count(v, "cercariaCounts"));
  count(input.observedSnails, "observedSnails", 1);
  positive(input.observationHours, "observationHours");
  const totalCercariae = input.cercariaCounts.reduce((a, b) => a + b, 0);
  return {
    totalCercariae,
    cercariaePerSnailHour:
      totalCercariae / (input.observedSnails * input.observationHours),
  };
};
export const exampleInput = {
  cercariaCounts: [20, 40],
  observedSnails: 2,
  observationHours: 2,
} satisfies Input;
export const exampleOutput = {
  totalCercariae: 60,
  cercariaePerSnailHour: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/snail-shedding-output",
  title: "Snail Shedding Output",
  description:
    "Normalize observed cercarial output to total snail-hours of observation.",
  inputs: [
    { id: "cercariaCounts", label: "Cercaria counts", kind: "numberList" },
    { id: "observedSnails", label: "Observed snails", kind: "integer" },
    { id: "observationHours", label: "Observation hours", kind: "number" },
  ],
  outputs: [
    { id: "totalCercariae", label: "Total cercariae", kind: "number" },
    {
      id: "cercariaePerSnailHour",
      label: "Cercariae per snail hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cercariaCounts: value.cercariaCounts as readonly number[],
      observedSnails: value.observedSnails as number,
      observationHours: value.observationHours as number,
    }),
});
export const run = tool.execute;
export default tool;
