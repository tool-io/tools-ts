import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, ordered } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly d25Mm: number;
  readonly d75Mm: number;
}>;
export type Output = Readonly<{ readonly traskSorting: number }>;
const inputFields = [
  { id: "d25Mm", label: "D25 mm", kind: "number" },
  { id: "d75Mm", label: "D75 mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.d25Mm, "d25Mm");
  positive(input.d75Mm, "d75Mm");
  ordered(input.d25Mm, input.d75Mm);
  return { traskSorting: Math.sqrt(input.d75Mm / input.d25Mm) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { d25Mm: 1, d75Mm: 4 } satisfies Input;
export const exampleOutput = { traskSorting: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/sorting-coefficient-trask",
  title: "Geology Sorting Coefficient Trask Calculator",
  description:
    "Trask√(D75/D25), ascending cumulative-percent-finer diameter quantiles. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [{ id: "traskSorting", label: "Trask sorting", kind: "number" }],
  calculate: (value) =>
    calculate({ d25Mm: value.d25Mm as number, d75Mm: value.d75Mm as number }),
});
export const run = tool.execute;
export default tool;
