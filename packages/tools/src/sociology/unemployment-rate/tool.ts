import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualUnemployedPeople: number;
  readonly actualLaborForcePeople: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualUnemployedPeople",
    label: "Actual unemployed people",
    kind: "number",
  },
  {
    id: "actualLaborForcePeople",
    label: "Actual labor force people",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualUnemployedPeople, "actualUnemployedPeople", 0, 1000000);
  bounded(input.actualLaborForcePeople, "actualLaborForcePeople", 1, 1000000);
  if (input.actualUnemployedPeople > input.actualLaborForcePeople)
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value: (100 * input.actualUnemployedPeople) / input.actualLaborForcePeople,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualUnemployedPeople: 2, actualLaborForcePeople: 4 },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/unemployment-rate",
  title: "Unemployment Rate Calculator",
  description:
    "Actual unemployment percentage with labor force not total population denominator. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
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
