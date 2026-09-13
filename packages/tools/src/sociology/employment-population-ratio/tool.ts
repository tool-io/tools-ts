import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualEmployedPeople: number;
  readonly actualWorkingAgePeople: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEmployedPeople",
    label: "Actual employed people",
    kind: "number",
  },
  {
    id: "actualWorkingAgePeople",
    label: "Actual working age people",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualEmployedPeople, "actualEmployedPeople", 0, 1000000);
  bounded(input.actualWorkingAgePeople, "actualWorkingAgePeople", 1, 1000000);
  if (input.actualEmployedPeople > input.actualWorkingAgePeople)
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value: (100 * input.actualEmployedPeople) / input.actualWorkingAgePeople,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualEmployedPeople: 2, actualWorkingAgePeople: 4 },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/employment-population-ratio",
  title: "Employment Population Ratio Calculator",
  description:
    "Actual employment population percentage. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
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
