import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, corpus } from "../batch53-shared.js";
import base from "../../logic/de-morgan-and-to-or-transformer/tool.js";
export type Input = Readonly<{
  seed: string;
  count: number;
  withoutReplacement: boolean;
  candidateInputsJson: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  {
    id: "candidateInputsJson",
    label: "Candidate inputs json",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return corpus(base, i, context).result;
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    seed: "tool.io/batch53",
    count: 1,
    withoutReplacement: true,
    candidateInputsJson: ['{"p": "p", "q": "q"}'],
  },
  output: {
    result: {
      baseToolId: "logic/de-morgan-and-to-or-transformer",
      selectedCandidateIndices: [0],
      unusedCandidateIndices: [],
      exercises: [
        {
          input: { p: "p", q: "q" },
          answer: { original: "!(p && q)", rewritten: "(!p || !q)" },
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/de-morgan-transformation-quiz",
  title: "Random De Morgan Transformation Quiz Generator",
  description:
    "Generate random de morgan transformation quiz generator cards from explicit candidate scenarios by importing logic/de-morgan-and-to-or-transformer. Validate every candidate, including undrawn ones, and resolve the seed/source once for all draws. Preserves the imported calculator limitations; not a full operational setup plan or guaranteed pedagogical correctness.",
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
