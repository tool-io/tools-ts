import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ names: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "names", label: "names", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  i.names.forEach((s) => H.check(s === "*" || H.token(s)));
  return H.finish({
    duplicates: H.duplicates(i.names, (x) => x.toLowerCase()),
    wildcard: i.names.includes("*"),
    wildcardMixed:
      i.names.includes("*") &&
      H.unique(i.names.map((x) => x.toLowerCase())).length > 1,
  });
};
export const example = {
  input: { names: ["X", "x", "*"] },
  output: {
    result: {
      duplicates: [{ key: "x", indexes: [0, 1] }],
      wildcard: true,
      wildcardMixed: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Vary Name Set Audit", "caching", "software development"],
    collections: ["data", "learn"],
    fields: ["cache", "caching", "software development"],
    keywords: ["caching", "software development"],
  },
  id: "cache/vary-name-set-audit",
  title: "Vary Name Set Audit",
  description:
    "Audit explicit Vary field-name set duplicates and mixed wildcard use under HTTP case-insensitive names; no header-line parser or policy repair.",
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
          duplicates: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["key", "indexes"],
            },
          },
          wildcard: { type: "boolean" },
          wildcardMixed: { type: "boolean" },
        },
        required: ["duplicates", "wildcard", "wildcardMixed"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
