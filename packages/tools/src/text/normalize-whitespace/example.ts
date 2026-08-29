import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    text: "  Hello   world\nfrom tool.io  ",
  },
  output: {
    text: "Hello world from tool.io",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
