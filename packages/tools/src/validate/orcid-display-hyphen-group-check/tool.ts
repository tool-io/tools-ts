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
    groupedShape: /^\d{4}-\d{4}-\d{4}-\d{3}[\dX](?![\s\S])/.test(i.identifier),
    checksumChecked: false,
  });
};
export const example = {
  input: { identifier: "0000-0002-1825-0097" },
  output: { result: { groupedShape: true, checksumChecked: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "validate/orcid-display-hyphen-group-check",
  title: "Validation: ORCID Display Hyphen Group Check Tool",
  description:
    "Check only the canonical ORCID display grouping and final X position, explicitly not the MOD11-2 checksum or registry existence.",
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
          checksumChecked: { type: "boolean" },
          groupedShape: { type: "boolean" },
        },
        required: ["checksumChecked", "groupedShape"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
