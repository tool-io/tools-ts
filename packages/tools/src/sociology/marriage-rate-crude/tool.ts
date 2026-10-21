import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMarriageEventCount: number;
  readonly actualMidperiodPopulation: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualMarriageEventCount",
    label: "Actual marriage event count",
    kind: "number",
  },
  {
    id: "actualMidperiodPopulation",
    label: "Actual mid period population",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  bounded(
    input.actualMarriageEventCount,
    "actualMarriageEventCount",
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
      (1000 * input.actualMarriageEventCount) / input.actualMidperiodPopulation,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualMarriageEventCount: 2, actualMidperiodPopulation: 4 },
  output: { result: { value: 500.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/marriage-rate-crude",
  title: "Crude Marriage Rate Calculator",
  description:
    "Actual crude marriage events per1000mid period population. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
