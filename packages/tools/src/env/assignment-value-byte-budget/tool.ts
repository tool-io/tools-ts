import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ assignmentsJson: string; budget: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "assignmentsJson", label: "assignmentsJson", kind: "string" },
  { id: "budget", label: "budget", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.budget, 0, 1e9);
  const r = H.assignments(i.assignmentsJson);
  return H.finish({
    records: r.map((v) => ({
      name: v.name,
      bytes: H.utf8(v.value),
      withinBudget: H.utf8(v.value) <= i.budget,
    })),
  });
};
export const example = {
  input: { assignmentsJson: '[{"name":"A","value":"\u00e9"}]', budget: 1 },
  output: {
    result: { records: [{ name: "A", bytes: 2, withinBudget: false }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Environment Assignment Value Byte Budget",
      "environment variables",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["env", "environment variables", "software development"],
    keywords: ["environment variables", "software development"],
  },
  id: "env/assignment-value-byte-budget",
  title: "Environment Assignment Value Byte Budget",
  description:
    "Audit explicit environment values against a supplied UTF-8 byte budget, excluding variable names, equals, NUL terminators and OS argv/env aggregate limits.",
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
          records: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                bytes: { type: "number" },
                withinBudget: { type: "boolean" },
              },
              required: ["name", "bytes", "withinBudget"],
            },
          },
        },
        required: ["records"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
