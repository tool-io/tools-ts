import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch53-shared.js";

export type Input = Readonly<{
  initialYield: number;
  finalYield: number;
  elapsedHours: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "initialYield", label: "Initial yield", kind: "number" },
  { id: "finalYield", label: "Final yield", kind: "number" },
  { id: "elapsedHours", label: "Elapsed hours", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  positive(i.initialYield, "initial");
  positive(i.finalYield, "final");
  positive(i.elapsedHours, "time");
  return {
    log10UnitsPerHour:
      (Math.log10(i.finalYield) - Math.log10(i.initialYield)) / i.elapsedHours,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { initialYield: 10, finalYield: 1000, elapsedHours: 2 },
  output: { result: { log10UnitsPerHour: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/rise-phase-log-slope-calculator",
  title: "Rise Phase Slope Log10 per Hour Growth Rate Calculator",
  description:
    "Calculate the signed observed rise-phase log10 slope from independently selected endpoints, not an automatic growth-curve phase fit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { log10UnitsPerHour: { type: "number" } },
        required: ["log10UnitsPerHour"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
