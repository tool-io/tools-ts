import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, countFraction } from "../batch53-shared.js";

export type Input = Readonly<{
  humanBloodMeals: number;
  identifiedBloodMeals: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "humanBloodMeals", label: "Human blood meals", kind: "number" },
  {
    id: "identifiedBloodMeals",
    label: "Identified blood meals",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    humanBloodIndex:
      1 * countFraction(i.humanBloodMeals, i.identifiedBloodMeals),
    causalInference: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { humanBloodMeals: 2, identifiedBloodMeals: 10 },
  output: {
    result: { humanBloodIndex: 0.2, causalInference: "not-established" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/human-blood-index-fraction-calculator",
  title: "Human Blood Index HBI Host Preference Fraction Calculator",
  description:
    "Compute the observed Human Blood Index HBI Host Preference Fraction Calculator fraction from explicit subset and total counts; not a transmission, survival or viability guarantee.",
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
