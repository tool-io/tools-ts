import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecimalToBcdInput = {
  readonly digits: string;
};

export type DecimalToBcdOutput = {
  readonly bcd: string;
};

export const decimalToBcdExample = {
  input: { digits: "19" },
  output: { bcd: "0001 1001" },
} satisfies ToolExample<DecimalToBcdInput, DecimalToBcdOutput>;

export const decimalToBcdTool = createSimpleTool({
  id: "convert/decimal-to-bcd",
  title: "Decimal to BCD Converter",
  description:
    "Encode a nonnegative decimal digit string into binary-coded decimal as space-separated 4-bit groups.",
  inputs: [{ id: "digits", kind: "string", label: "Digits" }],
  outputs: [{ id: "bcd", kind: "string", label: "BCD" }],
  calculate: (input) => {
    const digits = input.digits as string;
    if (digits === "")
      simpleError("digits", "Provide at least one digit.", "empty_digits");
    const groups = [...digits].map((character) => {
      const value = character.charCodeAt(0) - 48;
      if (value < 0 || value > 9)
        simpleError(
          "digits",
          `The character "${character}" is not a decimal digit.`,
          "invalid_digit",
        );
      return (value as number).toString(2).padStart(4, "0");
    });
    return { bcd: groups.join(" ") };
  },
});
export const runDecimalToBcd = decimalToBcdTool.execute;
export default decimalToBcdTool;
