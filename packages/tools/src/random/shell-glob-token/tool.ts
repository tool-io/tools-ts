// Repertoire source: https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html#tag_19_13
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomShellGlobTokenInput = Readonly<Record<string, never>>;
export type RandomShellGlobTokenOutput = { readonly value: string };

const source = { values: ["*", "?", "[...]", "[!...]", "\\"] } as const;

export const randomShellGlobTokenValueCount = 5;

export const calculateRandomShellGlobToken = (
  random: RandomSource = Math.random,
): RandomShellGlobTokenOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomShellGlobTokenExample = { input: {} } satisfies ToolExample<
  RandomShellGlobTokenInput,
  RandomShellGlobTokenOutput
>;

export const randomShellGlobTokenTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomShellGlobToken(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one portable POSIX shell pathname-expansion token prompt using injected randomness; the result is a fragment, not a complete pattern.",
  id: "random/shell-glob-token",
  inputs: [],
  outputs: [
    {
      format: "random/shell-glob-token",
      id: "value",
      kind: "string",
      label: "Random Shell Glob Token",
    },
  ],
  title: "Random Shell Glob Token Generator",
});

export const runRandomShellGlobToken = randomShellGlobTokenTool.execute;
export default randomShellGlobTokenTool;
