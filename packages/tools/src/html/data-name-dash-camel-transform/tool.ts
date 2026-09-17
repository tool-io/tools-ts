import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ attributeName: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "attributeName", kind: "string", label: "attributeName" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const name = H.asciiLower(i.attributeName);
  H.check(
    name.startsWith("data-") &&
      name.length > 5 &&
      !/[\t\n\f\r /=>"'<>`\u0000]/.test(name),
  );
  return H.finish({
    key: name.slice(5).replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()),
  });
};
export const example = {
  input: { attributeName: "data-user-id" },
  output: { result: { key: "userId" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/data-name-dash-camel-transform",
  title: "HTML Data Name Dash Camel Transform",
  description:
    "Convert a supplied HTML data-* attribute name to its dataset key using ASCII lowercase then dash-lowercase camelization; no Unicode case folding or DOM mutation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
