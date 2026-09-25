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
  return H.finish({
    valid: /^[0-9A-Za-z-]+(?![\s\S])/.test(i.identifier),
    numericOnly: /^\d+(?![\s\S])/.test(i.identifier),
    leadingZeroAllowed: true,
  });
};
export const example = {
  input: { identifier: "001" },
  output: {
    result: { valid: true, numericOnly: true, leadingZeroAllowed: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/semver-build-identifier-format",
  title: "Development: SemVer Build Identifier Format Tool",
  description:
    "Inspect a single SemVer build-metadata identifier, where numeric leading zeros are allowed unlike prerelease numeric identifiers; no full-version parsing.",
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
          leadingZeroAllowed: { type: "boolean" },
          numericOnly: { type: "boolean" },
          valid: { type: "boolean" },
        },
        required: ["leadingZeroAllowed", "numericOnly", "valid"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
