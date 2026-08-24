import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CaesarShiftInput = {
  readonly shift?: number;
  readonly text: string;
};

export type CaesarShiftOutput = {
  readonly result: string;
};

export const shiftLatinText = (text: string, shift: number): string =>
  text.replace(/[a-zA-Z]/g, (letter) => {
    const isUppercase = letter >= "A" && letter <= "Z";
    const base = isUppercase ? 65 : 97;
    const normalizedShift = ((shift % 26) + 26) % 26;
    return String.fromCharCode(
      ((letter.charCodeAt(0) - base + normalizedShift) % 26) + base,
    );
  });

export const caesarShiftExample = {
  input: { shift: 3, text: "Hello, World!" },
  output: { result: "Khoor, Zruog!" },
} satisfies ToolExample<CaesarShiftInput, CaesarShiftOutput>;

export const caesarShiftTool = createSimpleTool({
  id: "cryptography/caesar-shift",
  title: "Caesar Shift Cipher",
  description:
    "Shift Latin letters through the alphabet with wrap-around while preserving case; negative shifts decode.",
  inputs: [
    { id: "text", kind: "string", label: "Text" },
    {
      default: 3,
      id: "shift",
      kind: "integer",
      label: "Shift",
      maximum: 25,
      minimum: -25,
      required: false,
    },
  ],
  outputs: [{ id: "result", kind: "string", label: "Shifted text" }],
  calculate: (input) => ({
    result: shiftLatinText(input.text as string, input.shift as number),
  }),
});
export const runCaesarShift = caesarShiftTool.execute;
export default caesarShiftTool;
