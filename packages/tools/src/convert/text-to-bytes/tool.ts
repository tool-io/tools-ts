import { createSimpleTool } from "../../core/simple.js";
import { bytesToBase64, utf8Encode } from "../../core/encoding.js";
export const textToBytesTool = createSimpleTool({
  id: "convert/text-to-bytes",
  title: "UTF-8 Text to Bytes Converter",
  description:
    "Encode Unicode text as UTF-8 bytes represented with Base64 transport encoding.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    { id: "bytes", label: "UTF-8 bytes", kind: "bytes", format: "utf-8" },
  ],
  calculate: (input) => {
    return { bytes: bytesToBase64(utf8Encode(input.text as string)) };
  },
});
export const runTextToBytes = textToBytesTool.execute;
export default textToBytesTool;
