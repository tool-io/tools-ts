import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minorUnits: number;
  readonly digits: number;
  readonly symbol: string;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minorUnits: { type: "integer" },
    digits: { type: "integer", minimum: 0, maximum: 6 },
    symbol: { type: "string", maxLength: 8192 },
  },
  required: ["minorUnits", "digits", "symbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate money minor unit parenthesis style from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minorUnits, digits, symbol } = request;
  const compute = (): Output => {
    H.integer(digits, 0, 6);
    const amount = String(Math.abs(minorUnits)).padStart(digits + 1, "0"),
      body =
        symbol +
        (digits
          ? amount.slice(0, -digits) + "." + amount.slice(-digits)
          : amount);
    return { text: minorUnits < 0 ? "(" + body + ")" : body };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minorUnits: -12345, digits: 2, symbol: "$" },
  output: { text: "($123.45)" },
} satisfies ToolExample<Input, Output>;
export const moneyMinorUnitParenthesisStyleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/money-minor-unit-parenthesis-style",
    title: "Money Minor Unit Parenthesis Style Tool",
    description:
      "Calculate money minor unit parenthesis style from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minorUnits: { type: "integer" },
        digits: { type: "integer", minimum: 0, maximum: 6 },
        symbol: { type: "string", maxLength: 8192 },
      },
      required: ["minorUnits", "digits", "symbol"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "minorUnits",
          label: "Minor Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "digits",
          label: "Digits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "symbol",
          label: "Symbol",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = moneyMinorUnitParenthesisStyleTool.execute;
export default moneyMinorUnitParenthesisStyleTool;
