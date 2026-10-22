import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ recordsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.records(i.recordsJson).map((v) => ({
    style: H.styleRecord(JSON.stringify(v.style)),
    text: H.str(v.text),
  }));
  return H.finish({
    runs: H.runs(r, (v) => JSON.stringify(v.style)).map((g) => ({
      start: g.start,
      end: g.end,
      style: r[g.start].style,
      text:
        g.end > g.start
          ? r
              .slice(g.start, g.end)
              .map((v) => v.text)
              .join("")
          : "",
    })),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"style": {"bold": false, "faint": false, "italic": false, "underline": false, "inverse": false, "strike": false, "foreground": "default", "background": "default"}, "text": "a"}, {"style": {"bold": false, "faint": false, "italic": false, "underline": false, "inverse": false, "strike": false, "foreground": "default", "background": "default"}, "text": "b"}]',
  },
  output: {
    result: {
      runs: [
        {
          start: 0,
          end: 2,
          style: {
            bold: false,
            faint: false,
            italic: false,
            underline: false,
            inverse: false,
            strike: false,
            foreground: "default",
            background: "default",
          },
          text: "ab",
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Terminal Style Record Run Compactor",
      "terminal escape sequences",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["terminal", "terminal escape sequences", "software development"],
    keywords: ["terminal escape sequences", "software development"],
  },
  id: "terminal/style-record-run-compactor",
  title: "Terminal Style Record Run Compactor",
  description:
    "Compact adjacent complete supported terminal-style records after validated normalized style comparison; explicit text only, no escape scanning or terminal rendering.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          runs: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                start: { type: "number" },
                end: { type: "number" },
                style: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    bold: { type: "boolean" },
                    faint: { type: "boolean" },
                    italic: { type: "boolean" },
                    underline: { type: "boolean" },
                    inverse: { type: "boolean" },
                    strike: { type: "boolean" },
                    foreground: { type: "string" },
                    background: { type: "string" },
                  },
                  required: [
                    "bold",
                    "faint",
                    "italic",
                    "underline",
                    "inverse",
                    "strike",
                    "foreground",
                    "background",
                  ],
                },
                text: { type: "string" },
              },
              required: ["start", "end", "style", "text"],
            },
          },
        },
        required: ["runs"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
