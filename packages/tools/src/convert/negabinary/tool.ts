import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { value: -3 },
  output: { negabinary: "1101" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "convert/negabinary",
  title: "Negabinary Converter",
  description:
    "Encode a safe signed decimal integer in base −2, using digits 0 and 1 without a sign symbol.",
  inputs: [{ id: "value", kind: "integer", label: "value" }],
  outputs: [{ id: "negabinary", kind: "string", label: "negabinary" }],
  calculate: (input) => {
    let n = BigInt(input.value as number);
    if (n === 0n) return { negabinary: "0" };
    let digits = "";
    while (n !== 0n) {
      const bit = ((n % -2n) + 2n) % 2n;
      digits = bit.toString() + digits;
      n = (n - bit) / -2n;
    }
    return { negabinary: digits };
  },
});
export type NegabinaryInput = Readonly<typeof example.input>;
export type NegabinaryOutput = Readonly<typeof example.output>;
export const negabinaryTool = tool;
export const runNegabinary = tool.execute;
export default tool;
