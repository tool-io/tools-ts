import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const rot47Example = {
  input: { text: "Hello World!" },
  output: { result: "w6==@ (@C=5P" },
} satisfies ToolExample<{ readonly text: string }, { readonly result: string }>;

export const calculateRot47 = (input: {
  readonly text: string;
}): { readonly result: string } => ({
  result: [...input.text]
    .map((c) => {
      const code = c.charCodeAt(0);
      return code >= 33 && code <= 126
        ? String.fromCharCode(33 + ((code - 33 + 47) % 94))
        : c;
    })
    .join(""),
});

export const rot47Tool = createSimpleTool({
  calculate: (input) =>
    calculateRot47(input as unknown as { readonly text: string }),
  description: "Encode or decode text using the ROT47 cipher.",
  id: "convert/rot47",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [{ id: "result", kind: "string", label: "Result" }],
  title: "ROT47 Cipher",
});
export const runRot47 = rot47Tool.execute;
export default rot47Tool;
