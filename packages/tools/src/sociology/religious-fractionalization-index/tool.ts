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
  readonly actualQualifiedCategoryShares: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedCategoryShares",
    label: "Actual qualified category shares",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualQualifiedCategoryShares.length)
    simpleError(
      "actualQualifiedCategoryShares",
      "Actual nonempty observations.",
    );
  input.actualQualifiedCategoryShares.forEach((v) =>
    fraction(v, "actualQualifiedCategoryShares"),
  );
  if (Math.abs(sum(input.actualQualifiedCategoryShares) - 1) > 1e-9)
    simpleError("partition", "Actual complete partition sums1.");
  return {
    value: 1 - sum(input.actualQualifiedCategoryShares.map((v) => v * v)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualQualifiedCategoryShares: [0.5, 0.5] },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/religious-fractionalization-index",
  title: "Religious Fractionalization Index Calculator",
  description:
    "Observed religious fractionalization1\u2212\u03a3p\u00b2on independently observed mutually exclusive aggregate categories; share partition sums1, no personal category/identity inference, cause or universal societal risk.",
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
