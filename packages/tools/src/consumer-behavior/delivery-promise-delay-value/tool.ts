import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly promisedTimestampSeconds: number;
  readonly deliveredTimestampSeconds: number;
};
export type Output = { readonly delaySeconds: number; readonly late: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    promisedTimestampSeconds: { type: "number" },
    deliveredTimestampSeconds: { type: "number" },
  },
  required: ["promisedTimestampSeconds", "deliveredTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delaySeconds: { type: "number" }, late: { type: "boolean" } },
  required: ["delaySeconds", "late"],
} as const;
/** Compare an actual delivery timestamp with an explicit promised timestamp using a strict late boundary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { promisedTimestampSeconds, deliveredTimestampSeconds } = request;
  const compute = (): Output => {
    return {
      delaySeconds: deliveredTimestampSeconds - promisedTimestampSeconds,
      late: deliveredTimestampSeconds > promisedTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { promisedTimestampSeconds: 1000, deliveredTimestampSeconds: 1120 },
  output: { delaySeconds: 120, late: true },
} satisfies ToolExample<Input, Output>;
export const deliveryPromiseDelayValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/delivery-promise-delay-value",
    title: "Delivery Promise Delay Value",
    description:
      "Compare an actual delivery timestamp with an explicit promised timestamp using a strict late boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        promisedTimestampSeconds: { type: "number" },
        deliveredTimestampSeconds: { type: "number" },
      },
      required: ["promisedTimestampSeconds", "deliveredTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delaySeconds: { type: "number" },
        late: { type: "boolean" },
      },
      required: ["delaySeconds", "late"],
    },
    ports: {
      inputs: [
        {
          id: "promisedTimestampSeconds",
          label: "Promised Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deliveredTimestampSeconds",
          label: "Delivered Timestamp Seconds",
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
        { id: "late", label: "Late", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = deliveryPromiseDelayValueTool.execute;
export default deliveryPromiseDelayValueTool;
