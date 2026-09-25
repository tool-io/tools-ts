import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly line: string };
export type Output = {
  readonly key: string;
  readonly rawValue: string;
  readonly quoteMode: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { line: { type: "string", maxLength: 8192 } },
  required: ["line"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    rawValue: { type: "string", maxLength: 8192 },
    quoteMode: { type: "string", maxLength: 8192 },
  },
  required: ["key", "rawValue", "quoteMode"],
} as const;
/** Classify one simple dotenv assignment lexical quote mode without expanding escapes or variables. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { line } = input;
  const compute = (): Output => {
    const r = /^([A-Za-z_][A-Za-z0-9_]*)=([^\r\n]*)(?![\s\S])/.exec(line);
    H.domain(r !== null);
    const rawValue = r[2],
      quoteMode = rawValue.startsWith("\x27")
        ? "single"
        : rawValue.startsWith("\x22")
          ? "double"
          : "unquoted";
    H.domain(
      quoteMode === "unquoted" ||
        (rawValue.length >= 2 && rawValue.endsWith(rawValue[0])),
    );
    return { key: r[1], rawValue, quoteMode };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: 'PORT="3000"' },
  output: { key: "PORT", rawValue: '"3000"', quoteMode: "double" },
} satisfies ToolExample<Input, Output>;
export const dotenvSingleAssignmentQuoteModeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/dotenv-single-assignment-quote-mode",
    title: "Dotenv Single Assignment Quote Mode Tool",
    description:
      "Classify one simple dotenv assignment lexical quote mode without expanding escapes or variables.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { line: { type: "string", maxLength: 8192 } },
      required: ["line"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        key: { type: "string", maxLength: 8192 },
        rawValue: { type: "string", maxLength: 8192 },
        quoteMode: { type: "string", maxLength: 8192 },
      },
      required: ["key", "rawValue", "quoteMode"],
    },
    ports: {
      inputs: [
        {
          id: "line",
          label: "Line",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "key", label: "Key", valueType: { type: "string" } },
        { id: "rawValue", label: "Raw Value", valueType: { type: "string" } },
        { id: "quoteMode", label: "Quote Mode", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = dotenvSingleAssignmentQuoteModeTool.execute;
export default dotenvSingleAssignmentQuoteModeTool;
