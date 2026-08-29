import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

type Formula = {
  readonly op: string;
  readonly name?: string;
  readonly arg?: Formula;
  readonly args?: Formula[];
  readonly left?: Formula;
  readonly right?: Formula;
};
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const tseitinCnf = (json: string) => {
  let formula: unknown;
  try {
    formula = JSON.parse(json);
  } catch {
    simpleError("formula", "Enter valid JSON syntax-tree input.");
  }
  const variableIds = new Map<string, number>(),
    clauses: number[][] = [];
  let next = 1,
    nodes = 0;
  const fresh = () => {
    if (next > 10000)
      simpleError(
        "formula",
        "Formula exceeds 10,000 variables.",
        "resource_limit",
      );
    return next++;
  };
  const add = (clause: number[]) => {
    if (clauses.length >= 30000)
      simpleError(
        "formula",
        "Formula exceeds 30,000 clauses.",
        "resource_limit",
      );
    clauses.push(clause);
  };
  const compile = (node: unknown, depth: number): number => {
    if (depth > 100 || ++nodes > 10000)
      return simpleError(
        "formula",
        "Formula exceeds its 10,000-node or depth-100 limit.",
      );
    if (!record(node))
      return simpleError("formula", "Each formula node must be an object.");
    const op = node.op;
    if (op === "var") {
      const name = node.name;
      if (typeof name !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(name))
        return simpleError(
          "formula",
          "Variable names must be identifier strings.",
        );
      const existing = variableIds.get(name);
      if (existing !== undefined) return existing;
      const created = fresh();
      variableIds.set(name, created);
      return created;
    }
    if (op === "not") {
      const a = compile(node.arg, depth + 1),
        v = fresh();
      add([-v, -a]);
      add([v, a]);
      return v;
    }
    if (op === "and" || op === "or") {
      const nodes = node.args;
      if (!Array.isArray(nodes) || nodes.length < 2 || nodes.length > 1000)
        return simpleError("formula", "AND/OR needs 2–1000 arguments.");
      const args: number[] = nodes.map((arg: unknown) =>
          compile(arg, depth + 1),
        ),
        v = fresh();
      if (op === "and") {
        for (const a of args) add([-v, a]);
        add([v, ...args.map((a) => -a)]);
      } else {
        for (const a of args) add([v, -a]);
        add([-v, ...args]);
      }
      return v;
    }
    if (op === "implies")
      return compile(
        { op: "or", args: [{ op: "not", arg: node.left }, node.right] },
        depth + 1,
      );
    return simpleError(
      "formula",
      "Supported operations: var, not, and, or, implies.",
    );
  };
  const root = compile(formula, 0);
  add([root]);
  return { clauses, variables: Object.fromEntries(variableIds) };
};

export const example = {
  input: {
    formula:
      '{"op":"and","args":[{"op":"var","name":"a"},{"op":"var","name":"b"}]}',
  },
  output: {
    clauses: [[-3, 1], [-3, 2], [3, -1, -2], [3]],
    variables: { a: 1, b: 2 },
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "logic/sat-to-cnf",
  title: "SAT Formula to CNF Converter",
  description:
    "Convert a Boolean JSON syntax tree to equisatisfiable CNF clauses with Tseitin auxiliary variables. Supported operators are variable, NOT, AND, OR, and implication; integer literals use negative signs for negation.",
  inputs: [{ id: "formula", kind: "string", label: "Boolean formula JSON" }],
  outputs: [
    { id: "clauses", kind: "matrix", label: "CNF integer clauses" },
    { id: "variables", kind: "object", label: "Named variable IDs" },
  ],
  calculate: (input) => tseitinCnf(input.formula as string),
});
export type SatToCnfInput = Readonly<typeof example.input>;
export type SatToCnfOutput = Readonly<typeof example.output>;
export const satToCnfTool = tool;
export const runSatToCnf = tool.execute;
export default tool;
