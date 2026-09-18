import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ mediaType: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mediaType", label: "mediaType", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = H.media(i.mediaType);
  return H.finish({
    subtype: m.subtype,
    segments: m.subtype.split("+"),
    finalSuffix: m.subtype.includes("+")
      ? m.subtype.slice(m.subtype.lastIndexOf("+") + 1)
      : null,
  });
};
export const example = {
  input: { mediaType: "application/vnd.a+zip+json" },
  output: {
    result: {
      subtype: "vnd.a+zip+json",
      segments: ["vnd.a", "zip", "json"],
      finalSuffix: "json",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mime/media-type-subtype-plus-segment-inventory",
  title: "Media Type Subtype Plus Segment Inventory",
  description:
    "Inventory every plus-separated subtype segment, including empty segments, after token grammar validation; final structured suffix is not a registry claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
