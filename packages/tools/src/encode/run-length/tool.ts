import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { text: "aaabbc" },
  output: { encoded: "a3b2c1" },
} satisfies ToolExample<{ text: string }, { encoded: string }>;

export const encodeRunLengthTool = createSimpleTool({
  id: "encode/run-length",
  title: "Run-Length Encoder",
  description:
    "Compress letter-only text into count-annotated runs such as a3b2c1.",
  inputs: [
    {
      description: "Letters only; digits are reserved for counts.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Runs as a letter followed by its positive count.",
      id: "encoded",
      kind: "string",
      label: "Encoded",
    },
  ],
  calculate: (input) => {
    const text = String(input.text);
    if (!/^[a-zA-Z]*$/.test(text))
      return simpleError(
        "text",
        "text must contain only letters.",
        "text_invalid",
      );
    let output = "";
    let index = 0;
    while (index < text.length) {
      const character = text[index];
      let run = 1;
      while (index + run < text.length && text[index + run] === character)
        run += 1;
      output += character + String(run);
      index += run;
    }
    return { encoded: output };
  },
});

export const runEncodeRunLength = encodeRunLengthTool.execute;
export default encodeRunLengthTool;
