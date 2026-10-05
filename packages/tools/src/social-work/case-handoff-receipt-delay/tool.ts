import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sentTimestampSeconds: number;
  readonly receivedTimestampSeconds: number;
};
export type Output = { readonly delaySeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sentTimestampSeconds: { type: "number" },
    receivedTimestampSeconds: { type: "number" },
  },
  required: ["sentTimestampSeconds", "receivedTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delaySeconds: { type: "number" } },
  required: ["delaySeconds"],
} as const;
/** Measure an ordered case-handoff transmission-to-receipt interval on one common timestamp scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sentTimestampSeconds, receivedTimestampSeconds } = request;
  const compute = (): Output => {
    H.domain(
      receivedTimestampSeconds >= sentTimestampSeconds,
      "receivedTimestampSeconds",
    );
    return { delaySeconds: receivedTimestampSeconds - sentTimestampSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sentTimestampSeconds: 1000, receivedTimestampSeconds: 1090 },
  output: { delaySeconds: 90 },
} satisfies ToolExample<Input, Output>;
export const caseHandoffReceiptDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/case-handoff-receipt-delay",
    title: "Case Handoff Receipt Delay Tool",
    description:
      "Measure an ordered case-handoff transmission-to-receipt interval on one common timestamp scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sentTimestampSeconds: { type: "number" },
        receivedTimestampSeconds: { type: "number" },
      },
      required: ["sentTimestampSeconds", "receivedTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delaySeconds: { type: "number" } },
      required: ["delaySeconds"],
    },
    ports: {
      inputs: [
        {
          id: "sentTimestampSeconds",
          label: "Sent Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivedTimestampSeconds",
          label: "Received Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "delaySeconds",
          label: "Delay Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = caseHandoffReceiptDelayTool.execute;
export default caseHandoffReceiptDelayTool;
