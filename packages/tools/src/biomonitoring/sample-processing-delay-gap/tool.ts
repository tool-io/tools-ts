import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedAt: number;
  readonly processedAt: number;
  readonly suppliedLimit: number;
};
export type Output = { readonly delay: number; readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedAt: { type: "number" },
    processedAt: { type: "number" },
    suppliedLimit: { type: "number", minimum: 0 },
  },
  required: ["collectedAt", "processedAt", "suppliedLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delay: { type: "number" }, remaining: { type: "number" } },
  required: ["delay", "remaining"],
} as const;
/** Compare supplied research processing clocks with an explicit limit without specimen stability claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedAt, processedAt, suppliedLimit } = request;
  const compute = (): Output => {
    H.domain(processedAt >= collectedAt && suppliedLimit >= 0);
    return {
      delay: processedAt - collectedAt,
      remaining: suppliedLimit - processedAt + collectedAt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectedAt: 10, processedAt: 25, suppliedLimit: 20 },
  output: { delay: 15, remaining: 5 },
} satisfies ToolExample<Input, Output>;
export const sampleProcessingDelayGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/sample-processing-delay-gap",
    title: "Sample Processing Delay Gap Tool",
    description:
      "Compare supplied research processing clocks with an explicit limit without specimen stability claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedAt: { type: "number" },
        processedAt: { type: "number" },
        suppliedLimit: { type: "number", minimum: 0 },
      },
      required: ["collectedAt", "processedAt", "suppliedLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delay: { type: "number" }, remaining: { type: "number" } },
      required: ["delay", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "collectedAt",
          label: "Collected At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "processedAt",
          label: "Processed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "delay", label: "Delay", valueType: { type: "number" } },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sampleProcessingDelayGapTool.execute;
export default sampleProcessingDelayGapTool;
