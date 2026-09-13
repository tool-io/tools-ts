import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIncarceratedQualifiedPeople: number;
  readonly actualMatchedPopulation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIncarceratedQualifiedPeople",
    label: "Actual inc arc era ted qualified people",
    kind: "number",
  },
  {
    id: "actualMatchedPopulation",
    label: "Actual matched population",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualIncarceratedQualifiedPeople,
    "actualIncarceratedQualifiedPeople",
    0,
    1000000,
  );
  bounded(input.actualMatchedPopulation, "actualMatchedPopulation", 1, 1000000);
  if (input.actualIncarceratedQualifiedPeople > input.actualMatchedPopulation)
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value:
      (100000 * input.actualIncarceratedQualifiedPeople) /
      input.actualMatchedPopulation,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIncarceratedQualifiedPeople: 2, actualMatchedPopulation: 4 },
  output: { result: { value: 50000.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/incarceration-rate",
  title: "Incarceration Rate Calculator",
  description:
    "Actual incarceration point prevalence per100000. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
