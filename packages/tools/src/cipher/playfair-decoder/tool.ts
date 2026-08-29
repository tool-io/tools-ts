import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { playfairDecode } from "../playfair-core.js";

export const example = {
  input: { text: "GATLMZCLRQTX", key: "MONARCHY" },
  output: { result: "INSTRUMENTSZ" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "cipher/playfair-decoder",
  title: "Playfair Cipher Decoder",
  description:
    "Decrypt even-length Playfair ciphertext using a 5×5 key square. Output preserves filler letters because removal is ambiguous without context.",
  inputs: [
    { id: "text", kind: "string", label: "text" },
    { id: "key", kind: "string", label: "key" },
  ],
  outputs: [{ id: "result", kind: "string", label: "result" }],
  calculate: (input) => ({
    result: playfairDecode(input.text as string, input.key as string),
  }),
});
export type PlayfairDecoderInput = Readonly<typeof example.input>;
export type PlayfairDecoderOutput = Readonly<typeof example.output>;
export const playfairDecoderTool = tool;
export const runPlayfairDecoder = tool.execute;
export default tool;
