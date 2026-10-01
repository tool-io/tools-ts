import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly escape: string };
export type Output = {
  readonly hexWidth: number;
  readonly codePoint: number;
  readonly scalar: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { escape: { type: "string", maxLength: 8192 } },
  required: ["escape"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hexWidth: { type: "integer" },
    codePoint: { type: "integer" },
    scalar: { type: "boolean" },
  },
  required: ["hexWidth", "codePoint", "scalar"],
} as const;
/** Inspect a supplied Bash ANSI-C quoting Unicode escape without executing shell text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { escape } = request;
  const compute = (): Output => {
    const match = /^\\([uU])([0-9A-Fa-f]+)(?![\s\S])/.exec(escape);
    H.domain(match !== null);
    const hexWidth = match[1] === "u" ? 4 : 8;
    H.domain(match[2].length >= 1 && match[2].length <= hexWidth);
    const codePoint = parseInt(match[2], 16);
    return {
      hexWidth,
      codePoint,
      scalar:
        codePoint <= 1114111 && !(codePoint >= 55296 && codePoint <= 57343),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { escape: "\\u0041" },
  output: { hexWidth: 4, codePoint: 65, scalar: true },
} satisfies ToolExample<Input, Output>;
export const shellDollarQuoteUnicodeWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/shell-dollar-quote-unicode-width",
    title: "Shell Dollar Quote Unicode Width Tool",
    description:
      "Inspect a supplied Bash ANSI-C quoting Unicode escape without executing shell text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { escape: { type: "string", maxLength: 8192 } },
      required: ["escape"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hexWidth: { type: "integer" },
        codePoint: { type: "integer" },
        scalar: { type: "boolean" },
      },
      required: ["hexWidth", "codePoint", "scalar"],
    },
    ports: {
      inputs: [
        {
          id: "escape",
          label: "Escape",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "hexWidth", label: "Hex Width", valueType: { type: "integer" } },
        {
          id: "codePoint",
          label: "Code Point",
          valueType: { type: "integer" },
        },
        { id: "scalar", label: "Scalar", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = shellDollarQuoteUnicodeWidthTool.execute;
export default shellDollarQuoteUnicodeWidthTool;
