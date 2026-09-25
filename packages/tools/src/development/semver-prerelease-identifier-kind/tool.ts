import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ identifier: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "identifier", label: "Identifier", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    /^[0-9A-Za-z-]+(?![\s\S])/.test(i.identifier) &&
      !/^0[0-9]+(?![\s\S])/.test(i.identifier),
  );
  return H.finish({
    kind: /^[0-9]+(?![\s\S])/.test(i.identifier) ? "numeric" : "alphanumeric",
  });
};
export const example = {
  input: { identifier: "alpha1" },
  output: { result: { kind: "alphanumeric" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/semver-prerelease-identifier-kind",
  title: "Development: SemVer Prerelease Identifier Kind Tool",
  description:
    "Classify one SemVer prerelease identifier, rejecting empty, invalid-character and leading-zero numeric forms; not a full version parser.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { kind: { type: "string" } },
        required: ["kind"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
