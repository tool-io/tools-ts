import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const smdResistorCodeDecodeExample = {
  input: { code: "472" },
  output: { resistanceOhms: 4700 },
} satisfies ToolExample<
  { readonly code: string },
  { readonly resistanceOhms: number }
>;

export const smdResistorCodeDecodeTool = createSimpleTool({
  id: "electronics/smd-resistor-code-decode",
  title: "SMD Resistor Code",
  description:
    "Decode a three-digit SMD resistor code into resistance in ohms.",
  inputs: [{ id: "code", kind: "string", label: "SMD code" }],
  outputs: [
    { id: "resistanceOhms", kind: "number", label: "Resistance", unit: "Ω" },
  ],
  calculate: (input) => {
    const code = input.code as string;
    if (!/^\d{3}$/.test(code))
      simpleError(
        "code",
        "The SMD code must be exactly three digits.",
        "invalid_code",
      );
    const digits =
      (Number(code[0]) * 10 + Number(code[1])) * Math.pow(10, Number(code[2]));
    return { resistanceOhms: digits };
  },
});
export const runSmdResistorCodeDecode = smdResistorCodeDecodeTool.execute;
export default smdResistorCodeDecodeTool;
