import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualCallerDefinedMiddleClassEligiblePeople: number;
  readonly actualMatchedEligiblePeople: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCallerDefinedMiddleClassEligiblePeople",
    label: "Actual caller defined middle class eligible people",
    kind: "number",
  },
  {
    id: "actualMatchedEligiblePeople",
    label: "Actual matched eligible people",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualCallerDefinedMiddleClassEligiblePeople,
    "actualCallerDefinedMiddleClassEligiblePeople",
    0,
    1000000,
  );
  bounded(
    input.actualMatchedEligiblePeople,
    "actualMatchedEligiblePeople",
    1,
    1000000,
  );
  if (
    input.actualCallerDefinedMiddleClassEligiblePeople >
    input.actualMatchedEligiblePeople
  )
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value:
      (100 * input.actualCallerDefinedMiddleClassEligiblePeople) /
      input.actualMatchedEligiblePeople,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCallerDefinedMiddleClassEligiblePeople: 2,
    actualMatchedEligiblePeople: 4,
  },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/middle-class-share-percentage",
  title: "Middle Class Share Percentage Calculator",
  description:
    "Actual caller defined middle-class population percentage, definition not inferred. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
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
