import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ parameters: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "parameters", label: "parameters", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ style: H.replaySgr(i.parameters) });
};
export const example = {
  input: { parameters: [1, 31] },
  output: {
    result: {
      style: {
        bold: true,
        faint: false,
        italic: false,
        underline: false,
        inverse: false,
        strike: false,
        foreground: "index:1",
        background: "default",
      },
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Terminal SGR Normalized Style Replay",
      "terminal escape sequences",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["terminal", "terminal escape sequences", "software development"],
    keywords: ["terminal escape sequences", "software development"],
  },
  id: "terminal/sgr-normalized-style-replay",
  title: "Terminal SGR Normalized Style Replay",
  description:
    "Replay the documented finite SGR subset from default style: intensity, italic, underline, inverse, strike, basic/indexed/RGB colors; unsupported codes reject instead of being guessed.",
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
        },
        required: ["style"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
