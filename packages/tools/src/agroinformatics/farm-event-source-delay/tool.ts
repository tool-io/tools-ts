import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly ingestTime: number;
  readonly sourceOffset: number;
};
export type Output = {
  readonly normalizedEvent: number;
  readonly sourceDelay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    ingestTime: { type: "number" },
    sourceOffset: { type: "number" },
  },
  required: ["eventTime", "ingestTime", "sourceOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedEvent: { type: "number" },
    sourceDelay: { type: "number" },
  },
  required: ["normalizedEvent", "sourceDelay"],
} as const;
/** Compare supplied source/ingestion timestamps after explicit clock normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, ingestTime, sourceOffset } = request;
  const compute = (): Output => {
    return {
      normalizedEvent: eventTime - sourceOffset,
      sourceDelay: ingestTime - eventTime + sourceOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 100, ingestTime: 130, sourceOffset: 5 },
  output: { normalizedEvent: 95, sourceDelay: 35 },
} satisfies ToolExample<Input, Output>;
export const farmEventSourceDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/farm-event-source-delay",
    title: "Farm Event Source Delay Tool",
    description:
      "Compare supplied source/ingestion timestamps after explicit clock normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "number" },
        ingestTime: { type: "number" },
        sourceOffset: { type: "number" },
      },
      required: ["eventTime", "ingestTime", "sourceOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedEvent: { type: "number" },
        sourceDelay: { type: "number" },
      },
      required: ["normalizedEvent", "sourceDelay"],
    },
    ports: {
      inputs: [
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ingestTime",
          label: "Ingest Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceOffset",
          label: "Source Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedEvent",
          label: "Normalized Event",
          valueType: { type: "number" },
        },
        {
          id: "sourceDelay",
          label: "Source Delay",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmEventSourceDelayTool.execute;
export default farmEventSourceDelayTool;
