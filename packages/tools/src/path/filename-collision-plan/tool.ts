import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, filename } from "../batch53-shared.js";

export type Input = Readonly<{
  names: readonly string[];
  occupied: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "names", label: "Names", kind: "stringList" },
  { id: "occupied", label: "Occupied", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  [...i.names, ...i.occupied].forEach(filename);
  const reserved = new Set([...i.occupied, ...i.names]),
    assigned = new Set(i.occupied),
    out: string[] = [];
  for (const name of i.names) {
    if (!assigned.has(name)) {
      assigned.add(name);
      out.push(name);
      continue;
    }
    const dot = name.lastIndexOf("."),
      stem = dot > 0 ? name.slice(0, dot) : name,
      ext = dot > 0 ? name.slice(dot) : "";
    let k = 1,
      next = "";
    do {
      next = stem + " (" + k++ + ")" + ext;
    } while (reserved.has(next) || assigned.has(next));
    assigned.add(next);
    out.push(next);
  }
  return { plannedNames: out };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { names: ["a.txt", "a.txt"], occupied: [] },
  output: { result: { plannedNames: ["a.txt", "a (1).txt"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/filename-collision-plan",
  title: "Filename Collision Plan",
  description:
    "Plan exact-case filename collisions using numbered suffixes before the final extension, reserving all requested names; no files are touched.",
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
