import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { playfairEncode } from "../playfair-core.js";

export const example = {
  input: { text: "INSTRUMENTS", key: "MONARCHY" },
  output: { result: "GATLMZCLRQXA" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "cipher/playfair-encoder",
  title: "Playfair Cipher Encoder",
  description:
    "Encrypt letters with the classical 5×5 Playfair square, merging J into I and inserting X (or Q after X) between repeated digraph letters. This historical cipher is not secure.",
  inputs: [
    { id: "text", kind: "string", label: "text" },
    { id: "key", kind: "string", label: "key" },
  ],
  outputs: [{ id: "result", kind: "string", label: "result" }],
  calculate: (input) => ({
    result: playfairEncode(input.text as string, input.key as string),
  }),
});
export type PlayfairEncoderInput = Readonly<typeof example.input>;
export type PlayfairEncoderOutput = Readonly<typeof example.output>;
export const playfairEncoderTool = tool;
export const runPlayfairEncoder = tool.execute;
export default tool;
