import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ asciiCode: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "asciiCode", label: "Ascii code", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    Number.isInteger(i.asciiCode) &&
      ((i.asciiCode >= 0 && i.asciiCode <= 31) || i.asciiCode === 127),
  );
  return H.finish({
    caretToken:
      i.asciiCode === 127 ? "^?" : "^" + String.fromCharCode(i.asciiCode + 64),
  });
};
export const example = {
  input: { asciiCode: 0 },
  output: { result: { caretToken: "^@" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/ascii-control-caret-token",
  title: "Encoding: Ascii Control Caret Token Tool",
  description:
    "Format one ASCII C0 control or DEL byte in conventional caret notation; printable characters and C1 controls are not silently remapped.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { caretToken: { type: "string" } },
        required: ["caretToken"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
