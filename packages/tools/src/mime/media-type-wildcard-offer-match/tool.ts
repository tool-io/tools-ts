import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ range: string; offers: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "range", label: "range", kind: "string" },
  { id: "offers", label: "offers", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.media(i.range),
    r = i.offers.map(H.media);
  H.check(a.type !== "*" || a.subtype === "*");
  H.check(!a.type.includes("*") || a.type === "*");
  H.check(!a.subtype.includes("*") || a.subtype === "*");
  r.forEach((m) => H.check(!m.type.includes("*") && !m.subtype.includes("*")));
  return H.finish({
    matches: r.flatMap((m, index) =>
      (a.type === "*" || a.type === m.type) &&
      (a.subtype === "*" || a.subtype === m.subtype)
        ? [index]
        : [],
    ),
  });
};
export const example = {
  input: { range: "text/*", offers: ["text/html", "application/json"] },
  output: { result: { matches: [0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mime/media-type-wildcard-offer-match",
  title: "Media Type Wildcard Offer Match",
  description:
    "Match explicit */*, type/* or exact MIME ranges against complete offers with ASCII case folding; no quality, parameters or suffix wildcard matching.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
