import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  components,
  utf8,
} from "../batch53-shared.js";

export type Input = Readonly<{ path: string; maximumUtf8Bytes: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "path", label: "Path", kind: "string" },
  { id: "maximumUtf8Bytes", label: "Maximum utf8 bytes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.maximumUtf8Bytes, "budget", 1, 1000000);
  return {
    components: components(i.path).map((name, index) => ({
      index,
      name,
      utf8Bytes: utf8(name),
      withinBudget: utf8(name) <= i.maximumUtf8Bytes,
    })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { path: "a/é", maximumUtf8Bytes: 1 },
  output: {
    result: {
      components: [
        { index: 0, name: "a", utf8Bytes: 1, withinBudget: true },
        { index: 1, name: "é", utf8Bytes: 2, withinBudget: false },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/path-component-name-budget",
  title: "Path Component Name Budget Checker",
  description:
    "Audit lexical POSIX component UTF-8 byte budgets against an explicit limit; not a universal NAME_MAX or filesystem encoding claim.",
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
