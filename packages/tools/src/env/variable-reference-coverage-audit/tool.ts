import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string; available: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "text", label: "text", kind: "string" },
  { id: "available", label: "available", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.envRefs(i.text);
  return H.finish({
    references: r,
    missing: H.unique(
      r.map((v) => v.name).filter((x) => !i.available.includes(x)),
    ),
  });
};
export const example = {
  input: { text: "$A ${B}", available: ["A"] },
  output: {
    result: {
      references: [
        { name: "A", start: 0, end: 2 },
        { name: "B", start: 3, end: 7 },
      ],
      missing: ["B"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Environment Variable Reference Coverage Audit",
      "environment variables",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["env", "environment variables", "software development"],
    keywords: ["environment variables", "software development"],
  },
  id: "env/variable-reference-coverage-audit",
  title: "Environment Variable Reference Coverage Audit",
  description:
    "Audit coverage of literal simple environment-reference syntax against caller-known names, distinguishing unknown from present-empty; no process environment access.",
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
          references: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                start: { type: "number" },
                end: { type: "number" },
              },
              required: ["name", "start", "end"],
            },
          },
          missing: { type: "array", items: { type: "string" } },
        },
        required: ["references", "missing"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
