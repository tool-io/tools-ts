import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  candidates: readonly string[];
  ballotsJson: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "candidates", label: "candidates", kind: "stringList" },
  { id: "ballotsJson", label: "ballotsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const b = H.ballots(i.ballotsJson, i.candidates);
  const table = H.pairwise(b, i.candidates);
  return H.finish({
    winners: i.candidates.filter((_, j) =>
      i.candidates.every((_, k) => j === k || table[j][k] > table[k][j]),
    ),
  });
};
export const example = {
  input: {
    candidates: ["a", "b", "c"],
    ballotsJson: '[["a","b"],["b","a"],[]]',
  },
  output: { result: { winners: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Strict Pairwise Ballot Winner Check", "voting", "elections"],
    collections: ["data", "learn"],
    fields: ["ballot", "voting", "elections"],
    keywords: ["voting", "elections"],
  },
  id: "ballot/rank-strict-pairwise-winner",
  title: "Strict Pairwise Ballot Winner Check",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Require strictly greater observed preference against every other declared candidate; ties/unobserved pairs do not establish a strict winner.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { winners: { type: "array", items: { type: "string" } } },
        required: ["winners"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
