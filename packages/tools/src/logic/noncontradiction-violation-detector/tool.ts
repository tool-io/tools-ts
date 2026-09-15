import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, literal } from "../batch52-shared.js";
export type Input = Readonly<{ readonly declaredLiterals: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "declaredLiterals", label: "Declared literals", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  i.declaredLiterals.forEach(literal);
  const conflicts = [
    ...new Set(
      i.declaredLiterals.filter(
        (s) => !s.startsWith("!") && i.declaredLiterals.includes("!" + s),
      ),
    ),
  ].sort();
  return {
    contradictoryAtomIds: conflicts,
    explicitContradictionPresent: conflicts.length > 0,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { declaredLiterals: ["P", "!P", "Q"] },
  output: {
    result: { contradictoryAtomIds: ["P"], explicitContradictionPresent: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/noncontradiction-violation-detector",
  title: "Law of Non-Contradiction Violation Detector (P∧¬P)",
  description:
    "Find exact P and !P pairs in explicit classical literal inventory; no natural-language contradiction detection or SAT solving.",
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
