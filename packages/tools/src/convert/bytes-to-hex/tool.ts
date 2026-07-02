import { createSimpleTool } from "../../core/simple.js";
import { base64ToBytes } from "../../core/encoding.js";
export const bytesToHexTool = createSimpleTool({
  id: "convert/bytes-to-hex",
  title: "Bytes to Hex Converter",
  description:
    "Convert Base64-transported bytes to lowercase hexadecimal text.",
  inputs: [{ id: "bytes", label: "Bytes", kind: "bytes" }],
  outputs: [
    { id: "hex", label: "Hexadecimal bytes", kind: "string", format: "hex" },
  ],
  calculate: (input) => {
    return {
      hex: base64ToBytes(input.bytes as string)
        .map((value) => value.toString(16).padStart(2, "0"))
        .join(""),
    };
  },
});
export const runBytesToHex = bytesToHexTool.execute;
export default bytesToHexTool;
