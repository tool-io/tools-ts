import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type UnicodeForm = "NFC" | "NFD" | "NFKC" | "NFKD";

export type NormalizeUnicodeInput = {
  readonly form?: UnicodeForm;
  readonly text: string;
};

export type NormalizeUnicodeOutput = {
  readonly normalized: string;
};

export const normalizeUnicodeExample = {
  input: { form: "NFD", text: "ñ" },
  output: { normalized: "n\u0303" },
} satisfies ToolExample<NormalizeUnicodeInput, NormalizeUnicodeOutput>;

export const normalizeUnicodeTool = createSimpleTool({
  id: "text/normalize-unicode",
  title: "Unicode Normalizer",
  description: "Normalize text to a chosen Unicode normalization form.",
  inputs: [
    {
      default: "NFC",
      enum: ["NFC", "NFD", "NFKC", "NFKD"],
      id: "form",
      label: "Normalization form",
      kind: "string",
    },
    { id: "text", label: "Text", kind: "string" },
  ],
  outputs: [{ id: "normalized", label: "Normalized text", kind: "string" }],
  calculate: (input) => ({
    normalized: (input.text as string).normalize(input.form as UnicodeForm),
  }),
});
export const runNormalizeUnicode = normalizeUnicodeTool.execute;
export default normalizeUnicodeTool;
