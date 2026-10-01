import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly timestamp: number;
  readonly precision: number;
  readonly sourceId: string;
  readonly rounded: boolean;
};
export type Output = {
  readonly sourceId: string;
  readonly earliest: number;
  readonly latest: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timestamp: { type: "number" },
    precision: { type: "number", exclusiveMinimum: 0 },
    sourceId: { type: "string", maxLength: 8192 },
    rounded: { type: "boolean" },
  },
  required: ["timestamp", "precision", "sourceId", "rounded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192 },
    earliest: { type: "number" },
    latest: { type: "number" },
  },
  required: ["sourceId", "earliest", "latest"],
} as const;
/** Retain clock provenance alongside an explicit timestamp precision envelope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { timestamp, precision, sourceId, rounded } = request;
  const compute = (): Output => {
    H.positive(precision);
    H.domain(sourceId.length > 0, "sourceId");
    return {
      sourceId,
      earliest: rounded ? timestamp - precision / 2 : timestamp,
      latest: rounded ? timestamp + precision / 2 : timestamp + precision,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { timestamp: 100, precision: 10, sourceId: "clock-A", rounded: true },
  output: { sourceId: "clock-A", earliest: 95, latest: 105 },
} satisfies ToolExample<Input, Output>;
export const nursingCarelogSourceTimePrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/nursing-carelog-source-time-precision",
    title: "Nursing Carelog Source Time Precision Tool",
    description:
      "Retain clock provenance alongside an explicit timestamp precision envelope.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timestamp: { type: "number" },
        precision: { type: "number", exclusiveMinimum: 0 },
        sourceId: { type: "string", maxLength: 8192 },
        rounded: { type: "boolean" },
      },
      required: ["timestamp", "precision", "sourceId", "rounded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192 },
        earliest: { type: "number" },
        latest: { type: "number" },
      },
      required: ["sourceId", "earliest", "latest"],
    },
    ports: {
      inputs: [
        {
          id: "timestamp",
          label: "Timestamp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "precision",
          label: "Precision",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rounded",
          label: "Rounded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "sourceId", label: "Source Id", valueType: { type: "string" } },
        { id: "earliest", label: "Earliest", valueType: { type: "number" } },
        { id: "latest", label: "Latest", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nursingCarelogSourceTimePrecisionTool.execute;
export default nursingCarelogSourceTimePrecisionTool;
