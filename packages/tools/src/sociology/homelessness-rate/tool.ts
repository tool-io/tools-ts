import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualHomelessQualifiedPeople: number;
  readonly actualMatchedPopulation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualHomelessQualifiedPeople",
    label: "Actual homeless qualified people",
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
    input.actualHomelessQualifiedPeople,
    "actualHomelessQualifiedPeople",
    0,
    1000000,
  );
  bounded(input.actualMatchedPopulation, "actualMatchedPopulation", 1, 1000000);
  if (input.actualHomelessQualifiedPeople > input.actualMatchedPopulation)
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value:
      (10000 * input.actualHomelessQualifiedPeople) /
      input.actualMatchedPopulation,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualHomelessQualifiedPeople: 2, actualMatchedPopulation: 4 },
  output: { result: { value: 5000.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/homelessness-rate",
  title: "Homelessness Rate Calculator",
  description:
    "Actual homelessness count per10000population. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
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
