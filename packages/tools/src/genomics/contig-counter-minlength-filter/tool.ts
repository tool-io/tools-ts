import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{
  contigLengths: readonly number[];
  minimumLength: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "contigLengths", label: "Contig lengths", kind: "numberList" },
  { id: "minimumLength", label: "Minimum length", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.minimumLength, "minimum", 0, 1e12);
  i.contigLengths.forEach((v) => bounded(v, "length", 0, 1e12));
  return {
    atOrAboveMinimum: i.contigLengths.filter((v) => v >= i.minimumLength)
      .length,
    excludedCount: i.contigLengths.filter((v) => v < i.minimumLength).length,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { contigLengths: [1, 3, 5], minimumLength: 3 },
  output: { result: { atOrAboveMinimum: 2, excludedCount: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/contig-counter-minlength-filter",
  title: "Number of Contigs Counter with Min-Length Filter",
  description:
    "Count supplied contigs passing an inclusive minimum-length filter; no sequence parsing or hidden length inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          atOrAboveMinimum: { type: "number" },
          excludedCount: { type: "number" },
        },
        required: ["atOrAboveMinimum", "excludedCount"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
