import { createSimpleTool, simpleError } from "../../core/simple.js";
import { bytesToBase64 } from "../../core/encoding.js";
export const hexToBytesTool = createSimpleTool({
  id: "convert/hex-to-bytes",
  title: "Hex to Bytes Converter",
  description:
    "Convert hexadecimal text to bytes represented with Base64 transport encoding.",
  inputs: [
    { id: "hex", label: "Hexadecimal bytes", kind: "string", format: "hex" },
  ],
  outputs: [{ id: "bytes", label: "Bytes", kind: "bytes" }],
  calculate: (input) => {
    const text = input.hex as string;
    if (text.length % 2 !== 0 || !/^[0-9a-f]*$/iu.test(text))
      simpleError("hex", "Enter an even number of hexadecimal digits.");
    const bytes = [] as number[];
    for (let index = 0; index < text.length; index += 2)
      bytes.push(Number.parseInt(text.slice(index, index + 2), 16));
    return { bytes: bytesToBase64(bytes) };
  },
});
export const runHexToBytes = hexToBytesTool.execute;
export default hexToBytesTool;
