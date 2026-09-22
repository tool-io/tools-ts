import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionTime: number;
  readonly receivedTime: number;
  readonly processingTime: number;
  readonly collectionOffset: number;
  readonly processingOffset: number;
};
export type Output = {
  readonly transportDelay: number;
  readonly totalDelay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionTime: { type: "number" },
    receivedTime: { type: "number" },
    processingTime: { type: "number" },
    collectionOffset: { type: "number" },
    processingOffset: { type: "number" },
  },
  required: [
    "collectionTime",
    "receivedTime",
    "processingTime",
    "collectionOffset",
    "processingOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transportDelay: { type: "number" },
    totalDelay: { type: "number" },
  },
  required: ["transportDelay", "totalDelay"],
} as const;
/** Calculate biobank specimen collection processing delay from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    collectionTime,
    receivedTime,
    processingTime,
    collectionOffset,
    processingOffset,
  } = request;
  const compute = (): Output => {
    H.domain(
      receivedTime >= collectionTime - collectionOffset &&
        processingTime - processingOffset >= receivedTime,
    );
    return {
      transportDelay: receivedTime - collectionTime + collectionOffset,
      totalDelay:
        processingTime - processingOffset - collectionTime + collectionOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectionTime: 100,
    receivedTime: 108,
    processingTime: 115,
    collectionOffset: 1,
    processingOffset: 2,
  },
  output: { transportDelay: 9, totalDelay: 14 },
} satisfies ToolExample<Input, Output>;
export const biobankSpecimenCollectionProcessingDelayTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biobanking/biobank-specimen-collection-processing-delay",
      title: "Biobank Specimen Collection Processing Delay Tool",
      description:
        "Calculate biobank specimen collection processing delay from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          collectionTime: { type: "number" },
          receivedTime: { type: "number" },
          processingTime: { type: "number" },
          collectionOffset: { type: "number" },
          processingOffset: { type: "number" },
        },
        required: [
          "collectionTime",
          "receivedTime",
          "processingTime",
          "collectionOffset",
          "processingOffset",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          transportDelay: { type: "number" },
          totalDelay: { type: "number" },
        },
        required: ["transportDelay", "totalDelay"],
      },
      ports: {
        inputs: [
          {
            id: "collectionTime",
            label: "Collection Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "receivedTime",
            label: "Received Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "processingTime",
            label: "Processing Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "collectionOffset",
            label: "Collection Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "processingOffset",
            label: "Processing Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "transportDelay",
            label: "Transport Delay",
            valueType: { type: "number" },
          },
          {
            id: "totalDelay",
            label: "Total Delay",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biobankSpecimenCollectionProcessingDelayTool.execute;
export default biobankSpecimenCollectionProcessingDelayTool;
