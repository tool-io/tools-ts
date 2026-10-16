import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ key: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "key", kind: "string", label: "key" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(
    i.key.length > 0 &&
      !/-[a-z]/.test(i.key) &&
      !/[\t\n\f\r /=>"'<>`\u0000]/.test(i.key),
  );
  return H.finish({
    attributeName:
      "data-" + i.key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()),
  });
};
export const example = {
  input: { key: "userId" },
  output: { result: { attributeName: "data-user-id" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/data-key-camel-dash-transform",
  title: "HTML Data Key Camel Dash Transform",
  description:
    "Convert a valid dataset key to an HTML data-* attribute name, inserting dashes before ASCII uppercase letters; dash-lowercase keys are rejected under DOMStringMap rules.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { attributeName: { type: "string" } },
        required: ["attributeName"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
