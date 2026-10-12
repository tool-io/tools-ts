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
  return H.finish({ table });
};
export const example = {
  input: {
    candidates: ["a", "b", "c"],
    ballotsJson: '[["a","b"],["b","a"],[]]',
  },
  output: {
    result: {
      table: [
        [0, 1, 0],
        [1, 0, 0],
        [0, 0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Ranked Ballot Pairwise Preference Table", "voting", "elections"],
    collections: ["data", "learn"],
    fields: ["ballot", "voting", "elections"],
    keywords: ["voting", "elections"],
  },
  id: "ballot/rank-pairwise-preference-table",
  title: "Ranked Ballot Pairwise Preference Table",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Count pair preferences only when both candidates are explicitly ranked, lower index preferred; unranked pairs abstain and diagonal is zero.",
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
          table: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["table"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
