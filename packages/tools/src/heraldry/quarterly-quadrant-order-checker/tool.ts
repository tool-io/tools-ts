import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly annotatedQuarterOrdinals: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "annotatedQuarterOrdinals",
    label: "Annotated quarter ordinals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.annotatedQuarterOrdinals.length !== 4)
    simpleError(
      "quarters",
      "Exactly four annotated ordinals in viewer top-left, top-right, bottom-left, bottom-right order.",
    );
  input.annotatedQuarterOrdinals.forEach((v) => bounded(v, "ordinal", 1, 4));
  return {
    matchesEnglishQuarterOrder: input.annotatedQuarterOrdinals.every(
      (v, i) => v === i + 1,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { annotatedQuarterOrdinals: [1, 2, 3, 4] },
  output: { result: { matchesEnglishQuarterOrder: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/quarterly-quadrant-order-checker",
  title: "Quarterly Quadrant Assignment Order Checker",
  description:
    "Audit declared quarterly order1\u20134 in a named viewer frame; does not identify arms from imagery.",
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
