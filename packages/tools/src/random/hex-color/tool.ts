import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomInteger } from "../number/tool.js";
export const calculateRandomHexColor = (random = Math.random) => {
  const decimal = calculateRandomInteger(0, 0xffffff, random);
  return decimal === null
    ? null
    : {
        decimal,
        hex: `#${decimal.toString(16).toUpperCase().padStart(6, "0")}`,
      };
};
export const randomHexColorExample = { input: {} } satisfies ToolExample<
  Record<string, never>
>;
export const randomHexColorTool = createSimpleTool({
  id: "random/hex-color",
  title: "Random Hex Color Generator",
  description: "Generate a random six-digit hexadecimal CSS color.",
  inputs: [],
  outputs: [
    {
      format: "color/hex",
      id: "hex",
      kind: "string",
      label: "Random hex color",
    },
  ],
  calculate: (_, context) => {
    const result = calculateRandomHexColor(context.random ?? Math.random);
    if (!result)
      return simpleError(
        "",
        "The random source did not produce a usable value.",
      );
    return { hex: result.hex };
  },
});
export const runRandomHexColor = randomHexColorTool.execute;
export default randomHexColorTool;
