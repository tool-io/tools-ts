import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^(sha256|sha384|sha512)-([A-Za-z0-9+/]+={0,2})(?![\s\S])/.exec(
    i.token,
  );
  H.check(m && m[2].length % 4 === 0);
  return H.finish({ algorithm: m![1], digestBase64: m![2] });
};
export const example = {
  input: { token: "sha256-YWJj" },
  output: { result: { algorithm: "sha256", digestBase64: "YWJj" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/package-manager-integrity-token-split",
  title: "Development: Package Manager Integrity Token Split Tool",
  description:
    "Split one restricted sha256/384/512 integrity token into algorithm and Base64 digest text; does not verify digest bytes, algorithm length or package integrity.",
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
          algorithm: { type: "string" },
          digestBase64: { type: "string" },
        },
        required: ["algorithm", "digestBase64"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
