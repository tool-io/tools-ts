import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch53-shared.js";

export type Input = Readonly<{
  bitesPerPersonPerDay: number;
  sporozoiteFraction: number;
  seasonDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "bitesPerPersonPerDay",
    label: "Bites per person per day",
    kind: "number",
  },
  { id: "sporozoiteFraction", label: "Sporozoite fraction", kind: "number" },
  { id: "seasonDays", label: "Season days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.bitesPerPersonPerDay, "bites");
  fraction(i.sporozoiteFraction, "fraction");
  nonnegative(i.seasonDays, "days");
  return {
    conditionalInfectiveBitesPerPersonPerSeason:
      i.bitesPerPersonPerDay * i.sporozoiteFraction * i.seasonDays,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { bitesPerPersonPerDay: 2, sporozoiteFraction: 0.1, seasonDays: 100 },
  output: { result: { conditionalInfectiveBitesPerPersonPerSeason: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/eir-bites-person-season-calculator",
  title:
    "Entomological Inoculation Rate EIR bites per Person per Season Calculator",
  description:
    "Compute season EIR under constant observed biting and sporozoite rates; not an individual infection probability.",
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
