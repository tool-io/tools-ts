import { createSimpleTool, simpleError } from "../../core/simple.js";
import { toolResourceLimits } from "../../core/limits.js";
export const joinTool = createSimpleTool({
  id: "text/join",
  title: "String Join Tool",
  description: "Join a list of strings with a literal separator.",
  inputs: [
    { id: "parts", label: "Parts", kind: "stringList" },
    { id: "separator", label: "Separator", kind: "string" },
  ],
  outputs: [{ id: "text", label: "Joined text", kind: "string" }],
  calculate: (input) => {
    const text = (input.parts as string[]).join(input.separator as string);
    if (text.length > toolResourceLimits.textCharacters)
      simpleError("parts", "Joined text exceeds the output limit.");
    return { text };
  },
});
export const runJoin = joinTool.execute;
export default joinTool;
