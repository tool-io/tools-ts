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
  const cycles: string[][] = [];
  for (let a = 0; a < i.candidates.length; a++)
    for (let b = a + 1; b < i.candidates.length; b++)
      for (let c = a + 1; c < i.candidates.length; c++)
        if (
          b !== c &&
          table[a][b] > table[b][a] &&
          table[b][c] > table[c][b] &&
          table[c][a] > table[a][c]
        )
          cycles.push([i.candidates[a], i.candidates[b], i.candidates[c]]);
  return H.finish({ cycles });
};
export const example = {
  input: {
    candidates: ["a", "b", "c"],
    ballotsJson: '[["a","b","c"],["b","c","a"],["c","a","b"]]',
  },
  output: { result: { cycles: [["a", "b", "c"]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Pairwise Ballot Three Candidate Cycle Witnesses",
      "voting",
      "elections",
    ],
    collections: ["data", "learn"],
    fields: ["ballot", "voting", "elections"],
    keywords: ["voting", "elections"],
  },
  id: "ballot/rank-pairwise-cycle-witnesses",
  title: "Pairwise Ballot Three Candidate Cycle Witnesses",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Inventory strict directed three-candidate pairwise majority cycles once per rotation, retaining orientation; not a complete cycle decomposition.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cycles: {
            type: "array",
            items: { type: "array", items: { type: "string" } },
          },
        },
        required: ["cycles"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
