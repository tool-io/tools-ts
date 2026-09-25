import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ abbreviation: string; fullObjectId: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "abbreviation", label: "Abbreviation", kind: "string" },
  { id: "fullObjectId", label: "Full object id", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    /^[0-9a-f]{4,64}(?![\s\S])/.test(i.abbreviation) &&
      /^(?:[0-9a-f]{40}|[0-9a-f]{64})(?![\s\S])/.test(i.fullObjectId) &&
      i.abbreviation.length <= i.fullObjectId.length,
  );
  return H.finish({
    prefixMatches: i.fullObjectId.startsWith(i.abbreviation),
    uniquenessEstablished: false,
  });
};
export const example = {
  input: {
    abbreviation: "abcd",
    fullObjectId: "abcdef01abcdef01abcdef01abcdef01abcdef01",
  },
  output: { result: { prefixMatches: true, uniquenessEstablished: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/git-object-id-abbreviation-check",
  title: "Development: Git Object ID Abbreviation Check Tool",
  description:
    "Check one hex Git object-id abbreviation against a supplied full SHA-1/SHA-256 id; prefix matching does not establish repository-wide uniqueness.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prefixMatches: { type: "boolean" },
          uniquenessEstablished: { type: "boolean" },
        },
        required: ["prefixMatches", "uniquenessEstablished"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
