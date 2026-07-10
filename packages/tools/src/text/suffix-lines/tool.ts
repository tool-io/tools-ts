import { createSimpleTool, simpleError } from "../../core/simple.js";
import { toolResourceLimits } from "../../core/limits.js";
export const suffixLinesTool = createSimpleTool({
  id: "text/suffix-lines",
  title: "Text Suffix Lines Tool",
  description: "Add a literal suffix to every text line.",
  inputs: [
    { id: "text", label: "Text", kind: "string" },
    { id: "suffix", label: "Suffix", kind: "string" },
  ],
  outputs: [{ id: "text", label: "Suffixed text", kind: "string" }],
  calculate: (input) => {
    const text = (input.text as string)
      .split(/\r\n|\r|\n/u)
      .map((line) => line + (input.suffix as string))
      .join("\n");
    if (text.length > toolResourceLimits.textCharacters)
      simpleError("suffix", "Output exceeds the text limit.");
    return { text };
  },
});
export const runSuffixLines = suffixLinesTool.execute;
export default suffixLinesTool;
