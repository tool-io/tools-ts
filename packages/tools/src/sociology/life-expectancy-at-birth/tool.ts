import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualLifeTablePersonYearsByInterval: readonly number[];
  readonly actualLifeTableRadixAtBirth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLifeTablePersonYearsByInterval",
    label: "Actual life table person years by interval",
    kind: "numberList",
  },
  {
    id: "actualLifeTableRadixAtBirth",
    label: "Actual life table radix at birth",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualLifeTablePersonYearsByInterval.length)
    simpleError(
      "actualLifeTablePersonYearsByInterval",
      "Actual nonempty observations.",
    );
  input.actualLifeTablePersonYearsByInterval.forEach((v) =>
    nonnegative(v, "actualLifeTablePersonYearsByInterval"),
  );
  positive(input.actualLifeTableRadixAtBirth, "actualLifeTableRadixAtBirth");
  return {
    value:
      sum(input.actualLifeTablePersonYearsByInterval) /
      input.actualLifeTableRadixAtBirth,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualLifeTablePersonYearsByInterval: [20, 30],
    actualLifeTableRadixAtBirth: 10,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/life-expectancy-at-birth",
  title: "Life Expectancy at Birth Calculator",
  description:
    "Life-tablee0=\u03a3uppercaseintervalL/radixl0, complete open tail person years independently estimated, not assume square table or registry live expectancy.",
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
