import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ directivesJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "directivesJson", label: "directivesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const names = H.directives(i.directivesJson).map((v) => v.name);
  return H.finish({
    noStore: names.includes("no-store"),
    requiresValidation: names.includes("no-cache"),
    private: names.includes("private"),
    public: names.includes("public"),
    publicPrivateConflict:
      names.includes("private") && names.includes("public"),
  });
};
export const example = {
  input: {
    directivesJson:
      '[{"name":"no-cache","value":null},{"name":"public","value":null}]',
  },
  output: {
    result: {
      noStore: false,
      requiresValidation: true,
      private: false,
      public: true,
      publicPrivateConflict: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Cache Directive Presence Policy",
      "caching",
      "software development",
    ],
    collections: ["data", "learn"],
    fields: ["cache", "caching", "software development"],
    keywords: ["caching", "software development"],
  },
  id: "cache/directive-presence-policy",
  title: "Cache Directive Presence Policy",
  description:
    "Report conservative presence flags for explicit cache directives and public/private conflict, not a complete cacheability decision; no-cache does not mean no-store.",
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
          noStore: { type: "boolean" },
          requiresValidation: { type: "boolean" },
          private: { type: "boolean" },
          public: { type: "boolean" },
          publicPrivateConflict: { type: "boolean" },
        },
        required: [
          "noStore",
          "requiresValidation",
          "private",
          "public",
          "publicPrivateConflict",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
