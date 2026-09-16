import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  runs,
  parseJson,
  scalarKey,
} from "../batch53-shared.js";

export type Input = Readonly<{ arrayJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "arrayJson", label: "Array json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const v = parseJson(i.arrayJson);
  if (!Array.isArray(v)) simpleError("array", "Scalar JSON array required.");
  const a = v.map(scalarKey);
  return {
    runs: runs(a)
      .filter((r) => r.end - r.start > 1)
      .map((r) => ({ start: r.start, end: r.end, value: v[r.start] })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { arrayJson: '[1,1,"1",null,null]' },
  output: {
    result: {
      runs: [
        { start: 0, end: 2, value: 1 },
        { start: 3, end: 5, value: null },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-array-scalar-duplicate-spans",
  title: "JSON Scalar Array Duplicate Spans",
  description:
    "Report contiguous repeated typed-scalar array spans; do not conflate numeric/string values or nonadjacent duplicates.",
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
