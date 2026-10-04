import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly symbol: string };
export type Output = {
  readonly partner: string;
  readonly opening: boolean;
  readonly known: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partner: { type: "string", maxLength: 8192 },
    opening: { type: "boolean" },
    known: { type: "boolean" },
  },
  required: ["partner", "opening", "known"],
} as const;
/** Compute paired punctuation opening closing code point from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { symbol } = input;
  const compute = (): Output => {
    const pairs = ["()", "[]", "{}", "<>"],
      p = pairs.find((x) => x.includes(symbol));
    domain(symbol.length === 1);
    return {
      partner: p ? (p[0] === symbol ? p[1] : p[0]) : "",
      opening: !!p && p[0] === symbol,
      known: !!p,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { symbol: "(" },
  output: { partner: ")", opening: true, known: true },
} satisfies ToolExample<Input, Output>;
export const pairedPunctuationOpeningClosingCodePointTool =
  defineSchemaCalculation<Input, Output>({
    id: "text/paired-punctuation-opening-closing-code-point",
    title: "Paired Punctuation Opening Closing Code Point Tool",
    description:
      "Compute paired punctuation opening closing code point from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "symbol",
          label: "Symbol",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "partner", label: "Partner", valueType: { type: "string" } },
        { id: "opening", label: "Opening", valueType: { type: "boolean" } },
        { id: "known", label: "Known", valueType: { type: "boolean" } },
      ],
    },
  });
export const run = pairedPunctuationOpeningClosingCodePointTool.execute;
export default pairedPunctuationOpeningClosingCodePointTool;
