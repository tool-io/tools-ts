import { createSimpleTool, simpleError } from "../../core/simple.js";
import { toolResourceLimits } from "../../core/limits.js";
export const replaceLiteralTool = createSimpleTool({
  id: "text/replace-literal",
  title: "Text Replace Literal Tool",
  description: "Replace every literal occurrence of a search string.",
  inputs: [
    { id: "text", label: "Text", kind: "string" },
    { id: "search", label: "Search", kind: "string" },
    { id: "replacement", label: "Replacement", kind: "string" },
  ],
  outputs: [{ id: "text", label: "Replaced text", kind: "string" }],
  calculate: (input) => {
    const search = input.search as string;
    if (search === "") simpleError("search", "Search text must not be empty.");
    const text = (input.text as string)
      .split(search)
      .join(input.replacement as string);
    if (text.length > toolResourceLimits.textCharacters)
      simpleError("replacement", "Output exceeds the text limit.");
    return { text };
  },
});
export const runReplaceLiteral = replaceLiteralTool.execute;
export default replaceLiteralTool;
