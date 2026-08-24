import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GtinCheckDigitInput = {
  readonly digits: string;
  readonly mode: "compute" | "validate";
};

export type GtinCheckDigitOutput = {
  readonly computedCheckDigit: number;
  readonly gtinKind: string;
  readonly valid: boolean;
};

export const calculateGtinCheckDigit = (
  input: GtinCheckDigitInput,
): GtinCheckDigitOutput => {
  const digits = input.digits.trim();
  if (!/^\d+$/.test(digits))
    simpleError("digits", "GTIN input must contain decimal digits only.");
  const validLengths =
    input.mode === "validate" ? [8, 12, 13, 14] : [7, 11, 12, 13];
  if (!validLengths.includes(digits.length))
    simpleError(
      "digits",
      input.mode === "validate"
        ? "Validation mode requires a complete GTIN-8, GTIN-12, GTIN-13, or GTIN-14."
        : "Compute mode requires 7, 11, 12, or 13 data digits without the check digit.",
      "invalid_length",
    );
  const data = input.mode === "validate" ? digits.slice(0, -1) : digits;
  let sum = 0;
  for (let index = 0; index < data.length; index += 1) {
    const positionFromRight = data.length - index;
    sum += Number(data[index]) * (positionFromRight % 2 === 1 ? 3 : 1);
  }
  const computedCheckDigit = (10 - (sum % 10)) % 10;
  return {
    computedCheckDigit,
    gtinKind: `GTIN-${data.length + 1}`,
    valid:
      input.mode === "compute" ||
      Number(digits[digits.length - 1]) === computedCheckDigit,
  };
};

export const gtinCheckDigitExample = {
  input: { digits: "036000291452", mode: "validate" },
  output: { computedCheckDigit: 2, gtinKind: "GTIN-12", valid: true },
} satisfies ToolExample<GtinCheckDigitInput, GtinCheckDigitOutput>;

export const gtinCheckDigitTool = createSimpleTool({
  calculate: (input) =>
    calculateGtinCheckDigit({
      digits: input.digits as string,
      mode: input.mode as GtinCheckDigitInput["mode"],
    }),
  description:
    "Validate a complete GTIN-8, GTIN-12, GTIN-13, or GTIN-14, or compute the check digit from its data digits. An explicit mode avoids treating a 12- or 13-digit value as the wrong GTIN variant.",
  id: "validate/gtin-check-digit",
  inputs: [
    {
      description:
        "Complete GTIN in validation mode, or data digits without the check digit in compute mode.",
      id: "digits",
      kind: "string",
      label: "Digits",
    },
    {
      description: "Choose whether the input includes its check digit.",
      enum: ["validate", "compute"],
      id: "mode",
      kind: "string",
      label: "Mode",
    },
  ],
  outputs: [
    {
      description:
        "Whether a complete code is valid; true in compute mode when the data digits are accepted.",
      id: "valid",
      kind: "boolean",
      label: "Valid?",
    },
    {
      description:
        "Check digit calculated with the GS1 modulo-10 alternating 3/1 weighting.",
      id: "computedCheckDigit",
      kind: "integer",
      label: "Check digit",
    },
    {
      description: "GTIN length implied by the selected mode and input length.",
      id: "gtinKind",
      kind: "string",
      label: "Kind",
    },
  ],
  title: "GTIN Check Digit Validator",
});
export const runGtinCheckDigit = gtinCheckDigitTool.execute;
export { gtinCheckDigitExample as example };
export default gtinCheckDigitTool;
