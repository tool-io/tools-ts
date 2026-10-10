import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedPlaceholder: string;
  readonly useSquareBrackets: boolean;
};
export type Output = { readonly markedText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedPlaceholder: { type: "string", maxLength: 8192, minLength: 1 },
    useSquareBrackets: { type: "boolean" },
  },
  required: ["suppliedPlaceholder", "useSquareBrackets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { markedText: { type: "string", maxLength: 8192 } },
  required: ["markedText"],
} as const;
/** Format an explicitly supplied illegible-span placeholder with optional square brackets without restoring text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedPlaceholder, useSquareBrackets } = request;
  const compute = (): Output => {
    H.domain(suppliedPlaceholder.length > 0, "suppliedPlaceholder");
    return {
      markedText: useSquareBrackets
        ? "[" + suppliedPlaceholder + "]"
        : suppliedPlaceholder,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedPlaceholder: "illegible", useSquareBrackets: true },
  output: { markedText: "[illegible]" },
} satisfies ToolExample<Input, Output>;
export const historicalInscriptionIllegibleSpanMarkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["history", "humanities"],
        keywords: ["history", "humanities"],
      },
      id: "history/historical-inscription-illegible-span-mark",
      title: "Historical Inscription Illegible Span Mark",
      description:
        "Format an explicitly supplied illegible-span placeholder with optional square brackets without restoring text.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          suppliedPlaceholder: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          useSquareBrackets: { type: "boolean" },
        },
        required: ["suppliedPlaceholder", "useSquareBrackets"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { markedText: { type: "string", maxLength: 8192 } },
        required: ["markedText"],
      },
      ports: {
        inputs: [
          {
            id: "suppliedPlaceholder",
            label: "Supplied Placeholder",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "useSquareBrackets",
            label: "Use Square Brackets",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "markedText",
            label: "Marked Text",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = historicalInscriptionIllegibleSpanMarkTool.execute;
export default historicalInscriptionIllegibleSpanMarkTool;
