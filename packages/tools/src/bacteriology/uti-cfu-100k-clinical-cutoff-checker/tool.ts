import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch53-shared.js";

export type Input = Readonly<{ cfuPerMl: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cfuPerMl", label: "Cfu per ml", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.cfuPerMl, "count");
  return {
    atOrAboveHistorical100000: i.cfuPerMl >= 100000,
    diagnosis: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { cfuPerMl: 100000 },
  output: {
    result: { atOrAboveHistorical100000: true, diagnosis: "not-established" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/uti-cfu-100k-clinical-cutoff-checker",
  title: "Urinary Tract Infection CFU/mL 100000 Clinical Cutoff Checker",
  description:
    "Screen the historical 100000 CFU/mL threshold only; specimen method, symptoms, organism and patient context determine clinical interpretation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
