import { createSimpleTool, simpleError } from "../../core/simple.js";
import { toolResourceLimits } from "../../core/limits.js";
export const prefixLinesTool = createSimpleTool({
  id: "text/prefix-lines",
  title: "Text Prefix Lines Tool",
  description: "Add a literal prefix to every text line.",
  inputs: [
    { id: "text", label: "Text", kind: "string" },
    { id: "prefix", label: "Prefix", kind: "string" },
  ],
  outputs: [{ id: "text", label: "Prefixed text", kind: "string" }],
  calculate: (input) => {
    const text = (input.text as string)
      .split(/\r\n|\r|\n/u)
      .map((line) => (input.prefix as string) + line)
      .join("\n");
    if (text.length > toolResourceLimits.textCharacters)
      simpleError("prefix", "Output exceeds the text limit.");
    return { text };
  },
});
export const runPrefixLines = prefixLinesTool.execute;
export default prefixLinesTool;
