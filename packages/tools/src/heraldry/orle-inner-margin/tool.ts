import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fieldWidth: number;
  readonly bordureWidth: number;
  readonly orleOuterInset: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fieldWidth", label: "Field width", kind: "number" },
  { id: "bordureWidth", label: "Bordure width", kind: "number" },
  { id: "orleOuterInset", label: "Orle outer inset", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.fieldWidth, "fieldWidth");
  nonnegative(input.bordureWidth, "bordureWidth");
  nonnegative(input.orleOuterInset, "orleOuterInset");
  if (Math.max(input.bordureWidth, input.orleOuterInset) > input.fieldWidth / 2)
    simpleError("inset", "Insets within half envelope.");
  return {
    clearGap: input.orleOuterInset - input.bordureWidth,
    normalizedGap:
      (input.orleOuterInset - input.bordureWidth) / input.fieldWidth,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fieldWidth: 100, bordureWidth: 10, orleOuterInset: 15 },
  output: { result: { clearGap: 5, normalizedGap: 0.05 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/orle-inner-margin",
  title: "Orle Inner Margin Width Calculator",
  description:
    "Observed clear gap between bordure inner edge and orle outer edge; preserve signed overlap.",
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
