import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type EscapeInput = {
  readonly pattern?: string;
};

export type EscapeOutput = {
  readonly escaped: string;
};

export const calculateEscape = (input: EscapeInput): EscapeOutput => {
  return {
    escaped: (input.pattern ?? "1.5 (a+b)?").replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    ),
  };
};

export const escapeExample = {
  input: {
    pattern: "1.5 (a+b)?",
  },
  output: {
    escaped: "1\\.5 \\(a\\+b\\)\\?",
  },
} satisfies ToolExample<EscapeInput, EscapeOutput>;

export const escapeTool = createSimpleTool({
  id: "regex/escape",
  title: "Regex Escape",
  description:
    "Escape regular-expression metacharacters so arbitrary text can be embedded safely in a RegExp.",
  inputs: [
    {
      description: "Text to escape.",
      default: "1.5 (a+b)?",
      id: "pattern",
      kind: "string",
      label: "Pattern",
    },
  ],
  outputs: [
    {
      description: "Text with every RegExp metacharacter backslash-escaped.",
      id: "escaped",
      kind: "string",
      label: "Escaped",
    },
  ],
  calculate: (input) => calculateEscape({ pattern: input.pattern as string }),
});

export const runEscape = escapeTool.execute;
export default escapeTool;
