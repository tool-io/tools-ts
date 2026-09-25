import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ line: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "line", label: "Line", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^BRDA:(\d{1,9}),(\d{1,9}),(\d{1,9}),(-|\d{1,9})(?![\s\S])/.exec(
    i.line,
  );
  H.check(m && Number(m[1]) >= 1);
  return H.finish({
    lineNumber: Number(m![1]),
    block: Number(m![2]),
    branch: Number(m![3]),
    taken: m![4] === "-" ? -1 : Number(m![4]),
    executionKnown: m![4] !== "-",
  });
};
export const example = {
  input: { line: "BRDA:10,0,1,-" },
  output: {
    result: {
      lineNumber: 10,
      block: 0,
      branch: 1,
      taken: -1,
      executionKnown: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/lcov-branch-record-line-parser",
  title: "Development: LCOV Branch Record Line Parser Tool",
  description:
    "Parse one bounded LCOV BRDA branch record with unknown execution retained separately from zero; not a coverage report or merger.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          block: { type: "number" },
          branch: { type: "number" },
          executionKnown: { type: "boolean" },
          lineNumber: { type: "number" },
          taken: { type: "number" },
        },
        required: ["block", "branch", "executionKnown", "lineNumber", "taken"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
