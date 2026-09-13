import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualInformallyEmployedPeople: number;
  readonly actualAllEmployedPeople: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInformallyEmployedPeople",
    label: "Actual informally employed people",
    kind: "number",
  },
  {
    id: "actualAllEmployedPeople",
    label: "Actual all employed people",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualInformallyEmployedPeople,
    "actualInformallyEmployedPeople",
    0,
    1000000,
  );
  bounded(input.actualAllEmployedPeople, "actualAllEmployedPeople", 1, 1000000);
  if (input.actualInformallyEmployedPeople > input.actualAllEmployedPeople)
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value:
      (100 * input.actualInformallyEmployedPeople) /
      input.actualAllEmployedPeople,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualInformallyEmployedPeople: 2, actualAllEmployedPeople: 4 },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/informal-employment-rate",
  title: "Informal Employment Rate Calculator",
  description:
    "Actual informal employment percentage. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
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
