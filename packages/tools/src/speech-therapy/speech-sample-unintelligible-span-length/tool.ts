import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startTokenIndex: number;
  readonly endTokenIndexExclusive: number;
};
export type Output = { readonly tokenCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startTokenIndex: { type: "integer", minimum: 0 },
    endTokenIndexExclusive: { type: "integer" },
  },
  required: ["startTokenIndex", "endTokenIndexExclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tokenCount: { type: "integer" } },
  required: ["tokenCount"],
} as const;
/** Count a supplied half-open unintelligible token span without identifying speech or imputing its content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startTokenIndex, endTokenIndexExclusive } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(startTokenIndex) &&
        startTokenIndex >= 0 &&
        startTokenIndex <= Number.MAX_SAFE_INTEGER,
      "startTokenIndex",
    ),
      startTokenIndex);
    (H.domain(
      Number.isSafeInteger(endTokenIndexExclusive) &&
        endTokenIndexExclusive >= startTokenIndex &&
        endTokenIndexExclusive <= Number.MAX_SAFE_INTEGER,
      "endTokenIndexExclusive",
    ),
      endTokenIndexExclusive);
    return { tokenCount: endTokenIndexExclusive - startTokenIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startTokenIndex: 5, endTokenIndexExclusive: 9 },
  output: { tokenCount: 4 },
} satisfies ToolExample<Input, Output>;
export const speechSampleUnintelligibleSpanLengthTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["speech-therapy", "speech therapy", "health and medicine"],
        keywords: ["speech therapy", "health and medicine"],
      },
      id: "speech-therapy/speech-sample-unintelligible-span-length",
      title: "Speech Sample Unintelligible Span Length",
      description:
        "Count a supplied half-open unintelligible token span without identifying speech or imputing its content.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          startTokenIndex: { type: "integer", minimum: 0 },
          endTokenIndexExclusive: { type: "integer" },
        },
        required: ["startTokenIndex", "endTokenIndexExclusive"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { tokenCount: { type: "integer" } },
        required: ["tokenCount"],
      },
      ports: {
        inputs: [
          {
            id: "startTokenIndex",
            label: "Start Token Index",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "endTokenIndexExclusive",
            label: "End Token Index Exclusive",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "tokenCount",
            label: "Token Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = speechSampleUnintelligibleSpanLengthTool.execute;
export default speechSampleUnintelligibleSpanLengthTool;
