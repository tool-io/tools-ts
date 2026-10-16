import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ value: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "value", kind: "string", label: "value" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const double = H.attributeEscape(i.value, '"'),
    single = H.attributeEscape(i.value, "'");
  return H.finish({
    doubleLength: double.length + 2,
    singleLength: single.length + 2,
    preferred: double.length <= single.length ? "double" : "single",
    tie: double.length === single.length,
  });
};
export const example = {
  input: { value: '"x"' },
  output: {
    result: {
      doubleLength: 15,
      singleLength: 5,
      preferred: "single",
      tie: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/attribute-quote-choice-budget",
  title: "HTML Attribute Quote Choice Budget",
  description:
    "Compare serialized UTF-16 budgets for single- and double-quoted escaped HTML attribute values, including surrounding quotes; not a security or byte-size guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          doubleLength: { type: "number" },
          singleLength: { type: "number" },
          preferred: { type: "string" },
          tie: { type: "boolean" },
        },
        required: ["doubleLength", "singleLength", "preferred", "tie"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
