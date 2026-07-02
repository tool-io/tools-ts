import { createSimpleTool } from "../../core/simple.js";
export const characterCountTool = createSimpleTool({
  id: "text/character-count",
  title: "Character Count Tool",
  description: "Count Unicode code points in text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    { id: "characters", label: "Characters", kind: "integer", format: "count" },
  ],
  calculate: (input) => {
    return { characters: [...(input.text as string)].length };
  },
});
export const runCharacterCount = characterCountTool.execute;
export default characterCountTool;
