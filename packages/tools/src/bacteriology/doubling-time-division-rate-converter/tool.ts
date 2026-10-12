import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{ readonly divisionsPerHour: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "divisionsPerHour", label: "Divisions per hour", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.divisionsPerHour, "division rate");
  return { doublingHours: 1 / i.divisionsPerHour };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { divisionsPerHour: 2 },
  output: { result: { doublingHours: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/doubling-time-division-rate-converter",
  title: "Doubling Time from Division Rate per Hour Converter",
  description:
    "Doubling time from independently established generations/hour, not natural exponential mu; constant division rate assumed.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { doublingHours: { type: "number" } },
        required: ["doublingHours"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
