import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, histogram } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly annotatedTinctureTokens: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "annotatedTinctureTokens",
    label: "Annotated tincture tokens",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return histogram(input.annotatedTinctureTokens);
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { annotatedTinctureTokens: ["or", "gules", "or"] },
  output: { result: { tokens: ["or", "gules"], counts: [2, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/tincture-frequency-histogram",
  title: "Tincture Frequency Histogram Generator for a Roll",
  description:
    "Count independently annotated tincture occurrences in a roll; repeated occurrences are not per-arm presence.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
