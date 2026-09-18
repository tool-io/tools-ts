import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ line: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "line", label: "line", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(!/[\r\n\u0000]/.test(i.line));
  let quote = false,
    colon = -1;
  for (let j = 0; j < i.line.length; j++) {
    const c = i.line[j];
    if (quote && c === String.fromCharCode(92)) {
      H.check(++j < i.line.length);
      continue;
    }
    if (c === String.fromCharCode(34)) quote = !quote;
    else if (c === ":" && !quote) {
      colon = j;
      break;
    }
  }
  H.check(colon > 0 && !quote);
  const parts = H.httpSplit(i.line.slice(0, colon), ";"),
    name = parts[0].toUpperCase();
  H.icalName(name);
  return H.finish({
    name,
    parameters: parts.slice(1),
    value: i.line.slice(colon + 1),
  });
};
export const example = {
  input: { line: 'ATTENDEE;CN="A:B":mailto:a@b' },
  output: {
    result: { name: "ATTENDEE", parameters: ['CN="A:B"'], value: "mailto:a@b" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/content-line-name-parameter-split",
  title: "iCalendar Content Line Name Parameter Split",
  description:
    "Split an unfolded iCalendar content line at its unquoted first colon and semicolon parameter boundaries; value remains opaque, raw parameters retain quote-aware spelling, no RFC 6868 decoding or component validation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
