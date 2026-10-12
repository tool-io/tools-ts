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
  return H.finish({
    tally: i.candidates.map((candidate) => ({
      candidate,
      support: b.reduce((s, v, j) => s + (v.includes(candidate) ? 1 : 0), 0),
    })),
  });
};
export const example = {
  input: {
    candidates: ["a", "b", "c"],
    ballotsJson: '[["a","b"],["b","a"],[]]',
  },
  output: {
    result: {
      tally: [
        { candidate: "a", support: 2 },
        { candidate: "b", support: 2 },
        { candidate: "c", support: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Approval Set Ballot Count Tally", "voting", "elections"],
    collections: ["data", "learn"],
    fields: ["ballot", "voting", "elections"],
    keywords: ["voting", "elections"],
  },
  id: "ballot/approval-set-count-tally",
  title: "Approval Set Ballot Count Tally",
  description:
    "Explicit supplied candidate IDs and finite ballot observations only; no voter authenticity, eligibility, audit certification or election-result guarantee. Tally unique-candidate approval sets with one occurrence per ballot; repeated candidates reject instead of inflating support.",
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
          tally: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                candidate: { type: "string" },
                support: { type: "number" },
              },
              required: ["candidate", "support"],
            },
          },
        },
        required: ["tally"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
