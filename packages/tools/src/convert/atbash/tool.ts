import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const atbashExample = {
  input: { text: "Hello" },
  output: { result: "Svool" },
} satisfies ToolExample<{ readonly text: string }, { readonly result: string }>;

const atbashChar = (c: string): string => {
  const code = c.charCodeAt(0);
  if (code >= 65 && code <= 90) return String.fromCharCode(155 - code);
  if (code >= 97 && code <= 122) return String.fromCharCode(219 - code);
  return c;
};

export const calculateAtbash = (input: {
  readonly text: string;
}): { readonly result: string } => ({
  result: [...input.text].map(atbashChar).join(""),
});

export const atbashTool = createSimpleTool({
  calculate: (input) =>
    calculateAtbash(input as unknown as { readonly text: string }),
  description: "Encode or decode text using the Atbash cipher.",
  id: "convert/atbash",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [{ id: "result", kind: "string", label: "Result" }],
  title: "Atbash Cipher",
});
export const runAtbash = atbashTool.execute;
export default atbashTool;
