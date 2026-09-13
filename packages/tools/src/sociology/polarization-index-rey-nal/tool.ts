import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
  sum,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedAggregateShares: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedAggregateShares",
    label: "Actual qualified aggregate shares",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualQualifiedAggregateShares.length)
    simpleError(
      "actualQualifiedAggregateShares",
      "Actual nonempty observations.",
    );
  input.actualQualifiedAggregateShares.forEach((v) =>
    fraction(v, "actualQualifiedAggregateShares"),
  );
  if (Math.abs(sum(input.actualQualifiedAggregateShares) - 1) > 1e-9)
    simpleError("shares", "Actualcompletepartition.");
  return {
    value:
      4 * sum(input.actualQualifiedAggregateShares.map((v) => v * v * (1 - v))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualQualifiedAggregateShares: [0.5, 0.5] },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/polarization-index-rey-nal",
  title: "Reynal-Querol Polarization Index Calculator",
  description:
    "Reynal\u2013Querolpolarization4\u03a3p\u00b2(1\u2212p), actual complete exclusive aggregate category shares, no infer ethnicity/religion from records or individual/civil conflict risk.",
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
