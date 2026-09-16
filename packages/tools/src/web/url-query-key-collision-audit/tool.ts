import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, queryPairs } from "../batch53-shared.js";

export type Input = Readonly<{ query: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "query", label: "Query", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = queryPairs(i.query),
    m = new Map<string, number[]>();
  a.forEach((p) => {
    if (!m.has(p.name)) m.set(p.name, []);
    m.get(p.name)!.push(p.index);
  });
  return {
    collisions: [...m]
      .filter(([, a]) => a.length > 1)
      .map(([name, indexes]) => ({ name, indexes })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { query: "a=1&%61=2&b=3" },
  output: { result: { collisions: [{ name: "a", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/url-query-key-collision-audit",
  title: "URL Query Key Collision Audit",
  description:
    "Audit query-name collisions after form-style percent decoding; encoded spellings and duplicate source positions remain visible.",
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
