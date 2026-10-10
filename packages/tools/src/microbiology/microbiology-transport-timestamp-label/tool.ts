import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly collectionTimeText: string;
  readonly receivedTimeText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    collectionTimeText: { type: "string", maxLength: 8192, minLength: 1 },
    receivedTimeText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "collectionTimeText", "receivedTimeText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit transport timestamp text without resolving time zones or checking specimen stability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, collectionTimeText, receivedTimeText } = request;
  const compute = (): Output => {
    H.domain(
      sampleId.length > 0 &&
        collectionTimeText.length > 0 &&
        receivedTimeText.length > 0,
      "sampleId",
    );
    return {
      label:
        sampleId +
        "; collected=" +
        JSON.stringify(collectionTimeText) +
        "; received=" +
        JSON.stringify(receivedTimeText),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    collectionTimeText: "10:00 UTC",
    receivedTimeText: "11:30 UTC",
  },
  output: { label: 'S17; collected="10:00 UTC"; received="11:30 UTC"' },
} satisfies ToolExample<Input, Output>;
export const microbiologyTransportTimestampLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["microbiology", "biology"],
        keywords: ["microbiology", "biology"],
      },
      id: "microbiology/microbiology-transport-timestamp-label",
      title: "Microbiology Transport Timestamp Label",
      description:
        "Label explicit transport timestamp text without resolving time zones or checking specimen stability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleId: { type: "string", maxLength: 8192, minLength: 1 },
          collectionTimeText: { type: "string", maxLength: 8192, minLength: 1 },
          receivedTimeText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["sampleId", "collectionTimeText", "receivedTimeText"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "sampleId",
            label: "Sample Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "collectionTimeText",
            label: "Collection Time Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "receivedTimeText",
            label: "Received Time Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = microbiologyTransportTimestampLabelTool.execute;
export default microbiologyTransportTimestampLabelTool;
