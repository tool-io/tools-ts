import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ version: string; policy: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "version", label: "Version", kind: "string" },
  {
    id: "policy",
    label: "Policy",
    kind: "string",
    enum: ["require-v", "remove-v"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.policy, ["require-v", "remove-v"]);
  H.check(
    /^v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?![\s\S])/.test(
      i.version,
    ),
  );
  const base = i.version.startsWith("v") ? i.version.slice(1) : i.version;
  return H.finish({
    version: i.policy === "require-v" ? "v" + base : base,
    hadPrefix: i.version.startsWith("v"),
  });
};
export const example = {
  input: { version: "v1.2.3", policy: "remove-v" },
  output: { result: { version: "1.2.3", hadPrefix: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/release-version-v-prefix-policy",
  title: "Development: Release Version V Prefix Policy Tool",
  description:
    "Apply an explicit lowercase-v prefix display policy to a restricted three-integer release version; excludes prerelease/build metadata and leading-zero core numbers.",
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
          hadPrefix: { type: "boolean" },
          version: { type: "string" },
        },
        required: ["hadPrefix", "version"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
