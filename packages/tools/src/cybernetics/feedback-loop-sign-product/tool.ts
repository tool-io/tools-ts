import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly edgeSigns: readonly number[] };
export type Output = {
  readonly loopSign: number;
  readonly negativeFeedback: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeSigns: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["edgeSigns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loopSign: { type: "integer" },
    negativeFeedback: { type: "boolean" },
  },
  required: ["loopSign", "negativeFeedback"],
} as const;
/** Multiply explicit nonzero signed edges around a supplied loop to distinguish positive and negative loop polarity without assessing dynamic stability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edgeSigns } = request;
  const compute = (): Output => {
    H.domain(
      edgeSigns.length > 0 && edgeSigns.every((v) => v === -1 || v === 1),
      "edgeSigns",
    );
    const loopSign = edgeSigns.reduce<number>((a, b) => a * b, 1);
    return { loopSign, negativeFeedback: loopSign < 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edgeSigns: [1, 1, -1] },
  output: { loopSign: -1, negativeFeedback: true },
} satisfies ToolExample<Input, Output>;
export const feedbackLoopSignProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cybernetics", "engineering"],
      keywords: ["cybernetics", "engineering"],
    },
    id: "cybernetics/feedback-loop-sign-product",
    title: "Feedback Loop Sign Product",
    description:
      "Multiply explicit nonzero signed edges around a supplied loop to distinguish positive and negative loop polarity without assessing dynamic stability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeSigns: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["edgeSigns"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loopSign: { type: "integer" },
        negativeFeedback: { type: "boolean" },
      },
      required: ["loopSign", "negativeFeedback"],
    },
    ports: {
      inputs: [
        {
          id: "edgeSigns",
          label: "Edge Signs",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        { id: "loopSign", label: "Loop Sign", valueType: { type: "integer" } },
        {
          id: "negativeFeedback",
          label: "Negative Feedback",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedbackLoopSignProductTool.execute;
export default feedbackLoopSignProductTool;
