// Repertoire source: https://tc39.es/ecma262/multipage/text-processing.html#sec-patterns
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomRegularExpressionTokenInput = Readonly<Record<string, never>>;
export type RandomRegularExpressionTokenOutput = { readonly value: string };

const source = { values: [".", "*", "+", "?", "|", "^", "$", "(", ")", "[", "]", "{", "}", "\\", "(?:", "(?=", "(?!"] } as const;

export const randomRegularExpressionTokenValueCount = 17;

export const calculateRandomRegularExpressionToken = (
  random: RandomSource = Math.random,
): RandomRegularExpressionTokenOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomRegularExpressionTokenExample = { input: {} } satisfies ToolExample<
  RandomRegularExpressionTokenInput,
  RandomRegularExpressionTokenOutput
>;

export const randomRegularExpressionTokenTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomRegularExpressionToken(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one ECMAScript regular-expression syntax token prompt using injected randomness; the result is a token fragment, not a complete pattern.",
  id: "random/regular-expression-token",
  inputs: [],
  outputs: [
    {
      format: "random/regular-expression-token",
      id: "value",
      kind: "string",
      label: "Random Regular Expression Token",
    },
  ],
  title: "Random Regular Expression Token Generator",
});

export const runRandomRegularExpressionToken = randomRegularExpressionTokenTool.execute;
export default randomRegularExpressionTokenTool;
