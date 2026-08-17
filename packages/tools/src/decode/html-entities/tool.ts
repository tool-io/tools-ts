import { createSimpleTool } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    text: "&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&lt;/a&gt;",
  },
  output: { text: '<a href="x">Tom & Jerry</a>' },
} satisfies ToolExample<{ text: string }, { text: string }>;

const NAMED: Readonly<Record<string, string>> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

export const decodeHtmlEntitiesTool = createSimpleTool({
  id: "decode/html-entities",
  title: "HTML Entity Decoder",
  description:
    "Decode HTML syntax entities and decimal or hexadecimal numeric character references.",
  inputs: [
    {
      description: "Escaped HTML text.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Decoded plain text.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  calculate: (input) => ({
    text: String(input.text)
      .replaceAll(/&(?:amp|lt|gt|quot|#39|apos);/g, (entity) => NAMED[entity])
      .replaceAll(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
      .replaceAll(/&#x([0-9a-fA-F]+);/g, (_, code) =>
        String.fromCodePoint(Number.parseInt(code, 16)),
      ),
  }),
});

export const runDecodeHtmlEntities = decodeHtmlEntitiesTool.execute;
export default decodeHtmlEntitiesTool;
