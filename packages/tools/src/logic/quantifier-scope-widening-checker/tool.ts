import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, identifier } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly quantifier: string;
  readonly connective: string;
  readonly boundVariable: string;
  readonly independentPartFreeVariables: readonly string[];
  readonly callerDomainNonempty: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "quantifier", label: "Quantifier", kind: "string" },
  { id: "connective", label: "Connective", kind: "string" },
  { id: "boundVariable", label: "Bound variable", kind: "string" },
  {
    id: "independentPartFreeVariables",
    label: "Independent part free variables",
    kind: "stringList",
  },
  {
    id: "callerDomainNonempty",
    label: "Caller domain nonempty",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  pick(i.quantifier, { forall: 0, exists: 1 }, "quantifier");
  pick(i.connective, { AND: 0, OR: 1 }, "connective");
  identifier(i.boundVariable);
  i.independentPartFreeVariables.forEach(identifier);
  const needsNonempty =
    (i.quantifier === "forall" && i.connective === "AND") ||
    (i.quantifier === "exists" && i.connective === "OR");
  return {
    passesDeclaredScopeConditions:
      !i.independentPartFreeVariables.includes(i.boundVariable) &&
      (!needsNonempty || i.callerDomainNonempty),
    nonemptyDomainNeeded: needsNonempty,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    quantifier: "forall",
    connective: "AND",
    boundVariable: "x",
    independentPartFreeVariables: ["y"],
    callerDomainNonempty: true,
  },
  output: {
    result: { passesDeclaredScopeConditions: true, nonemptyDomainNeeded: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/quantifier-scope-widening-checker",
  title: "Quantifier Scope Widening Legality Checker",
  description:
    "Restricted scope widening for (Qx P) connective R to Qx(P connective R), given caller complete free-variable inventory; preserves empty-domain exceptions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
