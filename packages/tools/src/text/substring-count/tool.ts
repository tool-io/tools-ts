import { createSimpleTool, simpleError } from "../../core/simple.js";
export const substringCountTool = createSimpleTool({
  id: "text/substring-count",
  title: "Substring Count Tool",
  description: "Count non-overlapping occurrences of a literal substring.",
  inputs: [
    { id: "text", label: "Text", kind: "string" },
    { id: "substring", label: "Substring", kind: "string" },
  ],
  outputs: [
    { id: "count", label: "Occurrences", kind: "integer", format: "count" },
  ],
  calculate: (input) => {
    const substring = input.substring as string;
    if (substring === "")
      simpleError("substring", "Substring must not be empty.");
    let count = 0,
      index = 0,
      text = input.text as string;
    while ((index = text.indexOf(substring, index)) !== -1) {
      count += 1;
      index += substring.length;
    }
    return { count };
  },
});
export const runSubstringCount = substringCountTool.execute;
export default substringCountTool;
