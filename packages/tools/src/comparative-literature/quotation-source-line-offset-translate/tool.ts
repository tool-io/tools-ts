import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotationLine: number;
  readonly sourceStartLine: number;
};
export type Output = { readonly sourceLine: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotationLine: { type: "integer", minimum: 1 },
    sourceStartLine: { type: "integer", minimum: 1 },
  },
  required: ["quotationLine", "sourceStartLine"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sourceLine: { type: "integer" } },
  required: ["sourceLine"],
} as const;
/** Translate a one-based quotation line to a one-based source line using an explicitly supplied source start. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotationLine, sourceStartLine } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(quotationLine) &&
        quotationLine >= 1 &&
        quotationLine <= Number.MAX_SAFE_INTEGER,
      "quotationLine",
    ),
      quotationLine);
    (H.domain(
      Number.isSafeInteger(sourceStartLine) &&
        sourceStartLine >= 1 &&
        sourceStartLine <= Number.MAX_SAFE_INTEGER,
      "sourceStartLine",
    ),
      sourceStartLine);
    return {
      sourceLine: Number(BigInt(sourceStartLine) + BigInt(quotationLine) - 1n),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quotationLine: 3, sourceStartLine: 40 },
  output: { sourceLine: 42 },
} satisfies ToolExample<Input, Output>;
export const quotationSourceLineOffsetTranslateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/quotation-source-line-offset-translate",
    title: "Quotation Source Line Offset Translate",
    description:
      "Translate a one-based quotation line to a one-based source line using an explicitly supplied source start.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotationLine: { type: "integer", minimum: 1 },
        sourceStartLine: { type: "integer", minimum: 1 },
      },
      required: ["quotationLine", "sourceStartLine"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sourceLine: { type: "integer" } },
      required: ["sourceLine"],
    },
    ports: {
      inputs: [
        {
          id: "quotationLine",
          label: "Quotation Line",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceStartLine",
          label: "Source Start Line",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "sourceLine",
          label: "Source Line",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = quotationSourceLineOffsetTranslateTool.execute;
export default quotationSourceLineOffsetTranslateTool;
