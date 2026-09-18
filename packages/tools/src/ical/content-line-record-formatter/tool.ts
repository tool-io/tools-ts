import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  name: string;
  parameters: readonly string[];
  value: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "name", label: "name", kind: "string" },
  { id: "parameters", label: "parameters", kind: "stringList" },
  { id: "value", label: "value", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.icalName(i.name);
  H.check(!/[\r\n]/.test(i.value));
  i.parameters.forEach((p) =>
    H.check(
      /^[A-Za-z0-9-]+=/.test(p) &&
        !/[\r\n]/.test(p) &&
        H.lexicalSplit(p, ";").length === 1,
    ),
  );
  return H.finish({
    line:
      i.name.toUpperCase() +
      (i.parameters.length ? ";" + i.parameters.join(";") : "") +
      ":" +
      i.value,
  });
};
export const example = {
  input: { name: "summary", parameters: ["LANGUAGE=en"], value: "Hi" },
  output: { result: { line: "SUMMARY;LANGUAGE=en:Hi" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/content-line-record-formatter",
  title: "iCalendar Content Line Record Formatter",
  description:
    "Format one unfolded iCalendar content line from explicit raw already-encoded parameter/value tokens; rejects CRLF injection, no automatic TEXT escaping or RFC 6868 parameter encoding.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
