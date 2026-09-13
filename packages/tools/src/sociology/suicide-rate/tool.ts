import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualRecordedSuicideDeaths: number;
  readonly actualMidperiodPopulation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedSuicideDeaths",
    label: "Actual recorded suicide deaths",
    kind: "number",
  },
  {
    id: "actualMidperiodPopulation",
    label: "Actual mid period population",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualRecordedSuicideDeaths,
    "actualRecordedSuicideDeaths",
    0,
    1000000,
  );
  bounded(
    input.actualMidperiodPopulation,
    "actualMidperiodPopulation",
    1,
    1000000,
  );
  return {
    value:
      (100000 * input.actualRecordedSuicideDeaths) /
      input.actualMidperiodPopulation,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualRecordedSuicideDeaths: 2, actualMidperiodPopulation: 4 },
  output: { result: { value: 50000.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/suicide-rate",
  title: "Suicide Rate Calculator",
  description:
    "Actual observed suicide event rate per 100,000 population. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
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
