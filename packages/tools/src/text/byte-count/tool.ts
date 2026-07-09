import { createSimpleTool } from "../../core/simple.js";
import { utf8Encode } from "../../core/encoding.js";
export const byteCountTool = createSimpleTool({
  id: "text/byte-count",
  title: "Text Byte Count Tool",
  description: "Count the UTF-8 bytes required to encode Unicode text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    { id: "bytes", label: "UTF-8 bytes", kind: "integer", format: "count" },
  ],
  calculate: (input) => {
    return { bytes: utf8Encode(input.text as string).length };
  },
});
export const runByteCount = byteCountTool.execute;
export default byteCountTool;
