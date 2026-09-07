import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly annotatedConjunctionBoundaryTokens: readonly string[];
  readonly callerRepeatedConjunction: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "annotatedConjunctionBoundaryTokens",
    label: "Annotated conjunction boundary tokens",
    kind: "stringList",
  },
  {
    id: "callerRepeatedConjunction",
    label: "Caller repeated conjunction",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.annotatedConjunctionBoundaryTokens.length ||
    !input.callerRepeatedConjunction.trim()
  )
    simpleError("conjunction", "Explicit annotated boundary tokens and query.");
  return {
    repeatedBoundaryCount: input.annotatedConjunctionBoundaryTokens.filter(
      (v) => v === input.callerRepeatedConjunction,
    ).length,
    totalAnnotatedBoundaries: input.annotatedConjunctionBoundaryTokens.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    annotatedConjunctionBoundaryTokens: ["and", "and", "and"],
    callerRepeatedConjunction: "and",
  },
  output: { result: { repeatedBoundaryCount: 3, totalAnnotatedBoundaries: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/polysyndeton-many-ands-list-checker",
  title: "Polysyndeton Many Ands List Checker",
  description:
    "Count repeated conjunctions at independently annotated list boundaries; not count every arbitrary occurrence of and as polysyndeton.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
