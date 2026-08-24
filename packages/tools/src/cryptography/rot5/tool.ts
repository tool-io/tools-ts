import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Rot5Input = {
  readonly text: string;
};

export type Rot5Output = {
  readonly result: string;
};

export const applyRot5 = (text: string): string =>
  text.replace(/[0-9]/g, (digit) =>
    String.fromCharCode(((Number(digit) + 5) % 10) + 48),
  );

export const rot5Example = {
  input: { text: "0123456789" },
  output: { result: "5678901234" },
} satisfies ToolExample<Rot5Input, Rot5Output>;

export const rot5Tool = createSimpleTool({
  id: "cryptography/rot5",
  title: "ROT5 Cipher",
  description:
    "Rotate decimal digits 0-9 by five positions while leaving every other character unchanged.",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [{ id: "result", kind: "string", label: "ROT5 result" }],
  calculate: (input) => ({
    result: applyRot5(input.text as string),
  }),
});
export const runRot5 = rot5Tool.execute;
export default rot5Tool;
