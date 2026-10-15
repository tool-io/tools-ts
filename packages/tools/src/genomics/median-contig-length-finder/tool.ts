import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  quantile,
} from "../batch53-shared.js";

export type Input = Readonly<{ lengths: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "lengths", label: "Lengths", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  if (!i.lengths.length)
    simpleError("lengths", "Nonempty actual length observations.");
  i.lengths.forEach((v) => bounded(v, "length", 1, 1e12));
  return {
    lengthSummary: quantile(
      [...i.lengths].sort((a, b) => a - b),
      0.5,
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { lengths: [1, 2, 3] },
  output: { result: { lengthSummary: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/median-contig-length-finder",
  title: "Median Contig Length Positional Finder",
  description:
    "Compute Median Contig Length Positional Finder from explicitly observed positive base lengths; no assembly parsing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { lengthSummary: { type: "number" } },
        required: ["lengthSummary"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
