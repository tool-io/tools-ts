import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { encoded: "a3b2c1" },
  output: { text: "aaabbc" },
} satisfies ToolExample<{ encoded: string }, { text: string }>;

export const decodeRunLengthTool = createSimpleTool({
  id: "decode/run-length",
  title: "Run-Length Decoder",
  description:
    "Expand count-annotated runs such as a3b2c1 back into their full letter sequence.",
  inputs: [
    {
      description: "Runs as letter followed by optional count.",
      id: "encoded",
      kind: "string",
      label: "Encoded",
    },
  ],
  outputs: [
    {
      description: "Expanded letter sequence.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  calculate: (input) => {
    const encoded = String(input.encoded);
    if (!/^(?:[a-zA-Z]\d*)+$/.test(encoded))
      return simpleError(
        "encoded",
        "encoded must be letter-count runs such as a3b2c1.",
        "encoded_invalid",
      );
    let output = "";
    for (const match of encoded.matchAll(/([a-zA-Z])(\d*)/g)) {
      const count =
        match[2] === undefined || match[2] === "" ? 1 : Number(match[2]);
      if (count < 1)
        return simpleError(
          "encoded",
          "Run counts must be positive integers.",
          "encoded_invalid",
        );
      if (count > 100000)
        return simpleError(
          "encoded",
          "Run counts must not exceed 100000.",
          "resource_limit_exceeded",
        );
      output += match[1].repeat(count);
    }
    return { text: output };
  },
});

export const runDecodeRunLength = decodeRunLengthTool.execute;
export default decodeRunLengthTool;
