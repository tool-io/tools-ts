import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    lowercase: false,
    size: 2,
    text: "Hello world",
  },
  output: {
    shingles: ["Hello world"],
    total: 1,
    unique: 1,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
