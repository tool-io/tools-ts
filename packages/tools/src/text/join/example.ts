import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    parts: ["alpha", "beta", "alpha"],
    separator: ",",
  },
  output: {
    text: "alpha,beta,alpha",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
