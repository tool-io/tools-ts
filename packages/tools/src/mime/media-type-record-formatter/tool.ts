import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ mediaType: string; parametersJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "mediaType", label: "mediaType", kind: "string" },
  { id: "parametersJson", label: "parametersJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const m = H.media(i.mediaType),
    p = H.parameterRecords(i.parametersJson);
  return H.finish({
    value:
      m.type + "/" + m.subtype + (p.length ? "; " + H.parameterText(p) : ""),
  });
};
export const example = {
  input: {
    mediaType: "Text/HTML",
    parametersJson: '[{"name":"charset","value":"utf-8"}]',
  },
  output: { result: { value: "text/html; charset=utf-8" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Media Type Record Formatter", "MIME", "encoding"],
    collections: ["encode-decode"],
    fields: ["MIME", "encoding"],
    keywords: ["MIME", "encoding"],
  },
  id: "mime/media-type-record-formatter",
  title: "Media Type Record Formatter",
  description:
    "Format an explicit MIME media type and ordered parameter observations with token/quoted value serialization; preserves duplicates, no registered-value canonicalization.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "string" } },
        required: ["value"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
