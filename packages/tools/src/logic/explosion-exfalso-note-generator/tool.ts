import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, atom, literal } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly knownLiterals: readonly string[];
  readonly goalAtom: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "knownLiterals", label: "Known literals", kind: "stringList" },
  { id: "goalAtom", label: "Goal atom", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  i.knownLiterals.forEach(literal);
  atom(i.goalAtom);
  const contradictory = i.knownLiterals.some(
    (s) => !s.startsWith("!") && i.knownLiterals.includes("!" + s),
  );
  return {
    classicalExFalsoAvailable: contradictory,
    goal: i.goalAtom,
    nonclassicalLogicsNotAssumed: true,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { knownLiterals: ["P", "!P"], goalAtom: "Q" },
  output: {
    result: {
      classicalExFalsoAvailable: true,
      goal: "Q",
      nonclassicalLogicsNotAssumed: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/explosion-exfalso-note-generator",
  title: "Principle of Explosion Ex Falso Quodlibet Derivation Note Generator",
  description:
    "Explicit classical propositional contradiction/ex-falso premise screen, not validity in paraconsistent logics or truth of real-world claims.",
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
