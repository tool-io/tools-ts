import { createSimpleTool } from "../../core/simple.js";
import { base64ToBytes, utf8Decode } from "../../core/encoding.js";
export const bytesToTextTool = createSimpleTool({
  id: "convert/bytes-to-text",
  title: "Bytes to UTF-8 Text Converter",
  description: "Decode Base64-transported UTF-8 bytes into Unicode text.",
  inputs: [
    { id: "bytes", label: "UTF-8 bytes", kind: "bytes", format: "utf-8" },
  ],
  outputs: [{ id: "text", label: "Text", kind: "string" }],
  calculate: (input) => {
    return { text: utf8Decode(base64ToBytes(input.bytes as string)) };
  },
});
export const runBytesToText = bytesToTextTool.execute;
export default bytesToTextTool;
