import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ code: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "code", label: "Code", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.code, 0, 9);
  return H.finish({
    missing: i.code === 9,
    oktas: i.code === 9 ? -1 : i.code,
    fraction: i.code === 9 ? 0 : i.code / 8,
  });
};
export const example = {
  input: { code: 9 },
  output: { result: { missing: true, oktas: -1, fraction: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "atmospheric-science/cloud-cover-okta-missing-code-label",
  title: "Atmospheric Science: Cloud Cover Okta Missing Code Label Tool",
  description:
    "Interpret an explicitly declared cloud-cover coding scheme 0..8 oktas and 9 obscured/missing, retaining missing status separately from unused zero fraction.",
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
          fraction: { type: "number" },
          missing: { type: "boolean" },
          oktas: { type: "number" },
        },
        required: ["fraction", "missing", "oktas"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
