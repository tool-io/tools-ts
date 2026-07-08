import { createSimpleTool, simpleError } from "../../core/simple.js";
import { toolResourceLimits } from "../../core/limits.js";
export const repeatTool = createSimpleTool({
  id: "text/repeat",
  title: "Repeat Text Tool",
  description:
    "Repeat text a nonnegative number of times within portable resource limits.",
  inputs: [
    { id: "text", label: "Text", kind: "string" },
    { id: "count", label: "Repetitions", kind: "integer", minimum: 0 },
  ],
  outputs: [{ id: "text", label: "Repeated text", kind: "string" }],
  calculate: (input) => {
    const text = input.text as string,
      count = input.count as number;
    if (text.length * count > toolResourceLimits.textCharacters)
      simpleError("count", "Repeated text exceeds the output limit.");
    return { text: text.repeat(count) };
  },
});
export const runRepeat = repeatTool.execute;
export default repeatTool;
