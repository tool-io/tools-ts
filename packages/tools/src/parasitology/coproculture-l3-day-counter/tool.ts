import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  daysBetween,
} from "../batch53-shared.js";

export type Input = Readonly<{
  cultureStartDate: string;
  observationDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cultureStartDate", label: "Culture start date", kind: "string" },
  { id: "observationDate", label: "Observation date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const elapsedDays = daysBetween(i.cultureStartDate, i.observationDate);
  nonnegative(elapsedDays, "dates");
  return { elapsedDays, l3DifferentiationEstablished: false };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { cultureStartDate: "2026-01-01", observationDate: "2026-01-05" },
  output: { result: { elapsedDays: 4, l3DifferentiationEstablished: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/coproculture-l3-day-counter",
  title: "Larval Culture Coproculture L3 Differentiation Day Counter",
  description:
    "Count calendar days in a larval culture; elapsed duration does not confirm development to L3.",
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
