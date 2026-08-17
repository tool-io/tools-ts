import { createSimpleTool } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { text: '<a href="x">Tom & Jerry</a>' },
  output: {
    encoded: "&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&lt;/a&gt;",
  },
} satisfies ToolExample<{ text: string }, { encoded: string }>;

const ENTITIES: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const encodeHtmlEntitiesTool = createSimpleTool({
  id: "encode/html-entities",
  title: "HTML Entity Encoder",
  description:
    "Escape the five HTML-significant characters ampersand, angle brackets, quote, and apostrophe.",
  inputs: [
    {
      description: "Text to escape.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Escaped text safe for HTML bodies and attributes.",
      id: "encoded",
      kind: "string",
      label: "Encoded",
    },
  ],
  calculate: (input) => ({
    encoded: String(input.text).replaceAll(
      /[&<>"']/g,
      (character) => ENTITIES[character],
    ),
  }),
});

export const runEncodeHtmlEntities = encodeHtmlEntitiesTool.execute;
export default encodeHtmlEntitiesTool;
