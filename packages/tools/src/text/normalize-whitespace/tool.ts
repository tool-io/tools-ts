import { createSimpleTool } from "../../core/simple.js";
export const normalizeWhitespaceTool = createSimpleTool({
  id: "text/normalize-whitespace",
  title: "Text Whitespace Normalizer",
  description:
    "Collapse Unicode whitespace runs to single spaces and trim the result.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "text", label: "Normalized text", kind: "string" }],
  calculate: (input) => {
    return { text: (input.text as string).trim().replace(/\s+/gu, " ") };
  },
});
export const runNormalizeWhitespace = normalizeWhitespaceTool.execute;
export default normalizeWhitespaceTool;
