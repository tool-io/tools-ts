import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly vinesPerHectare: number;
  readonly minutesPerVine: number;
  readonly workers: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "vinesPerHectare", label: "Vines per hectare", kind: "number" },
  { id: "minutesPerVine", label: "Minutes per vine", kind: "number" },
  { id: "workers", label: "Workers", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.vinesPerHectare, "vines");
  nonnegative(i.minutesPerVine, "minutes");
  bounded(i.workers, "workers", 1, 1000000);
  return {
    crewHoursPerHectare:
      (i.vinesPerHectare * i.minutesPerVine) / (60 * i.workers),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { vinesPerHectare: 1200, minutesPerVine: 3, workers: 2 },
  output: { result: { crewHoursPerHectare: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/winter-pruning-hours-per-hectare",
  title: "Winter Pruning Hours Per Hectare Calculator",
  description:
    "Winter-pruning crew elapsed hours per hectare under caller measured productivity; not a agronomic pruning schedule.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { crewHoursPerHectare: { type: "number" } },
        required: ["crewHoursPerHectare"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
