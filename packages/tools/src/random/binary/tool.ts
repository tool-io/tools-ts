import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomRadixValue } from "../radix-value/tool.js";
export const randomBinaryExample = {
  input: { includePrefix: true, maximum: 255, minimum: 0, width: 8 },
} satisfies ToolExample<{
  readonly includePrefix: boolean;
  readonly maximum: number;
  readonly minimum: number;
  readonly width: number;
}>;
export const randomBinaryTool = createSimpleTool({
  id: "random/binary",
  title: "Random Binary Value Generator",
  description: "Generate a random nonnegative integer formatted in base 2.",
  inputs: [
    { id: "minimum", kind: "integer", label: "Minimum", minimum: 0 },
    { id: "maximum", kind: "integer", label: "Maximum", minimum: 0 },
    {
      id: "width",
      kind: "integer",
      label: "Minimum width",
      maximum: 64,
      minimum: 1,
    },
    {
      default: true,
      id: "includePrefix",
      kind: "boolean",
      label: "Include 0b prefix",
    },
  ],
  outputs: [
    {
      format: "radix/binary",
      id: "value",
      kind: "string",
      label: "Random binary value",
    },
  ],
  calculate: (input, context) => {
    const result = calculateRandomRadixValue(
      input.minimum as number,
      input.maximum as number,
      input.width as number,
      2,
      input.includePrefix as boolean,
      context.random ?? Math.random,
    );
    if (!result)
      return simpleError("maximum", "Enter an ordered nonnegative range.");
    return { value: result.text };
  },
});
export const runRandomBinary = randomBinaryTool.execute;
export default randomBinaryTool;
