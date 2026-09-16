import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  filename,
} from "../batch53-shared.js";

export type Input = Readonly<{ names: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "names", label: "Names", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  i.names.forEach((v) => {
    filename(v);
    if (/[^\x00-\x7f]/.test(v))
      simpleError("name", "ASCII-only casefold branch.");
  });
  const keys = i.names.map((v) => v.toLowerCase());
  return {
    collisions: [...new Set(keys)].flatMap((key) => {
      const indexes = keys.flatMap((v, j) => (v === key ? [j] : []));
      return indexes.length > 1 ? [{ folded: key, indexes }] : [];
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { names: ["A.txt", "a.txt", "b.txt"] },
  output: { result: { collisions: [{ folded: "a.txt", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/filename-casefold-collision-table",
  title: "Filename Casefold Collision Table",
  description:
    "Audit the bounded ASCII case-insensitive filename branch; rejects non-ASCII rather than pretend lowercasing implements full Unicode case folding.",
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
