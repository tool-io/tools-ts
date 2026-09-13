import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedCohabitingEligiblePeople: number;
  readonly actualEligibleAdultPopulation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedCohabitingEligiblePeople",
    label: "Actual qualified cohabiting eligible people",
    kind: "number",
  },
  {
    id: "actualEligibleAdultPopulation",
    label: "Actual eligible adult population",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualQualifiedCohabitingEligiblePeople,
    "actualQualifiedCohabitingEligiblePeople",
    0,
    1000000,
  );
  bounded(
    input.actualEligibleAdultPopulation,
    "actualEligibleAdultPopulation",
    1,
    1000000,
  );
  if (
    input.actualQualifiedCohabitingEligiblePeople >
    input.actualEligibleAdultPopulation
  )
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value:
      (100 * input.actualQualifiedCohabitingEligiblePeople) /
      input.actualEligibleAdultPopulation,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedCohabitingEligiblePeople: 2,
    actualEligibleAdultPopulation: 4,
  },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/cohabitation-rate",
  title: "Cohabitation Rate Calculator",
  description:
    "Actual cohabitation percentage. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
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
