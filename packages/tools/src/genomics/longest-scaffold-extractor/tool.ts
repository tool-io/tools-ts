import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch53-shared.js";

export type Input = Readonly<{ lengths: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lengths", label: "Lengths", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.lengths.length)
    simpleError("lengths", "Nonempty actual length observations.");
  i.lengths.forEach((v) => bounded(v, "length", 1, 1e12));
  return { lengthSummary: Math.max(...i.lengths) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { lengths: [1, 2, 3] },
  output: { result: { lengthSummary: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/longest-scaffold-extractor",
  title: "Longest Scaffold Length Extractor",
  description:
    "Compute Longest Scaffold Length Extractor from explicitly observed positive base lengths; no assembly parsing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
