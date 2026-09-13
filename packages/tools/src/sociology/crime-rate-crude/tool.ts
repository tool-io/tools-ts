import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualRecordedCrimeEvents: number;
  readonly actualMatchedPopulation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedCrimeEvents",
    label: "Actual recorded crime events",
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
    input.actualRecordedCrimeEvents,
    "actualRecordedCrimeEvents",
    0,
    1000000,
  );
  bounded(input.actualMatchedPopulation, "actualMatchedPopulation", 1, 1000000);
  return {
    value:
      (100000 * input.actualRecordedCrimeEvents) /
      input.actualMatchedPopulation,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualRecordedCrimeEvents: 2, actualMatchedPopulation: 4 },
  output: { result: { value: 50000.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/crime-rate-crude",
  title: "Crude Crime Rate Calculator",
  description:
    "Actual crude crime events per 100,000 population. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
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
